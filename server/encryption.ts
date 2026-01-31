import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

// Get or generate encryption key from environment
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable must be set for data encryption");
  }

  // Key should be 32 bytes (256 bits) for AES-256
  return crypto.scryptSync(key, "salt", 32);
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * Returns base64-encoded string containing IV + authTag + encrypted data
 */
export function encrypt(text: string): string {
  if (!text) return "";

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Combine IV + authTag + encrypted data
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, "hex"),
  ]);

  return combined.toString("base64");
}

/**
 * Decrypts data encrypted with encrypt()
 * Expects base64-encoded string containing IV + authTag + encrypted data
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return "";

  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedData, "base64");

  // Extract IV, authTag, and encrypted data
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH
  });
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted.toString("hex"), "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Encrypts user sensitive data before storing in database
 * Note: We only store birth year (not full DOB) for compliance
 */
export function encryptUserData(data: {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  birthYear?: string;
  ssnLast4?: string;
}) {
  return {
    addressEncrypted: data.address ? encrypt(data.address) : undefined,
    cityEncrypted: data.city ? encrypt(data.city) : undefined,
    stateEncrypted: data.state ? encrypt(data.state) : undefined,
    zipEncrypted: data.zip ? encrypt(data.zip) : undefined,
    birthYearEncrypted: data.birthYear ? encrypt(data.birthYear) : undefined,
    ssnLast4Encrypted: data.ssnLast4 ? encrypt(data.ssnLast4) : undefined,
  };
}

/**
 * Decrypts user sensitive data after retrieving from database
 */
export function decryptUserData(user: {
  addressEncrypted?: string | null;
  cityEncrypted?: string | null;
  stateEncrypted?: string | null;
  zipEncrypted?: string | null;
  birthYearEncrypted?: string | null;
  ssnLast4Encrypted?: string | null;
}) {
  return {
    address: user.addressEncrypted ? decrypt(user.addressEncrypted) : undefined,
    city: user.cityEncrypted ? decrypt(user.cityEncrypted) : undefined,
    state: user.stateEncrypted ? decrypt(user.stateEncrypted) : undefined,
    zip: user.zipEncrypted ? decrypt(user.zipEncrypted) : undefined,
    birthYear: user.birthYearEncrypted ? decrypt(user.birthYearEncrypted) : undefined,
    ssnLast4: user.ssnLast4Encrypted ? decrypt(user.ssnLast4Encrypted) : undefined,
  };
}

/**
 * Masks an account number, showing only the last 4 digits
 */
export function maskAccountNumber(accountNumber: string | null | undefined): string | null {
  if (!accountNumber) return null;
  // Remove non-alphanumeric characters for processing
  const cleaned = accountNumber.replace(/[^a-zA-Z0-9]/g, '');
  if (cleaned.length <= 4) return cleaned;
  return `****${cleaned.slice(-4)}`;
}

/**
 * Deeply searches and masks sensitive fields in an object or array
 * Sensitive fields include anything ending in 'Encrypted' and 'accountNumber'
 */
export function maskSensitiveData(data: any): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item));
  }

  if (typeof data === "object") {
    const masked: any = {};
    for (const key in data) {
      // Completely strip encrypted blobs from responses
      if (key.endsWith("Encrypted")) {
        continue;
      }

      // Mask account numbers
      if (key === "accountNumber") {
        masked[key] = maskAccountNumber(data[key]);
        continue;
      }

      // Recursively process objects and arrays
      if (data[key] !== null && typeof data[key] === "object") {
        masked[key] = maskSensitiveData(data[key]);
      } else {
        masked[key] = data[key];
      }
    }
    return masked;
  }

  return data;
}
