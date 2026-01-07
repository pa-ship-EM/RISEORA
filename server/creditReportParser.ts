import type { InsertCreditReportAccount } from '@shared/schema';

// pdf-parse is a CommonJS module
const pdfParse = require('pdf-parse');

interface ParsedAccount {
  creditorName: string;
  accountNumber?: string;
  accountType?: string;
  accountStatus?: string;
  paymentStatus?: string;
  isNegative: boolean;
  balance?: number;
  creditLimit?: number;
  highBalance?: number;
  monthlyPayment?: number;
  dateOpened?: Date;
  lastReportedDate?: Date;
  rawText: string;
}

interface ParseResult {
  bureau?: string;
  reportDate?: Date;
  accounts: ParsedAccount[];
  totalAccounts: number;
  negativeAccounts: number;
}

// Common account type patterns
const ACCOUNT_TYPE_PATTERNS: Record<string, RegExp> = {
  CREDIT_CARD: /credit card|revolving|visa|mastercard|amex|discover|card/i,
  MORTGAGE: /mortgage|home loan|housing|real estate/i,
  AUTO_LOAN: /auto|vehicle|car loan|automobile/i,
  STUDENT_LOAN: /student|education|school loan/i,
  PERSONAL_LOAN: /personal|installment|unsecured/i,
  COLLECTION: /collection|collections|collect/i,
  MEDICAL: /medical|healthcare|hospital|doctor/i,
  RETAIL: /retail|store|department/i,
};

// Negative status indicators
const NEGATIVE_INDICATORS = [
  /collection/i,
  /charge.?off/i,
  /delinquent/i,
  /past.?due/i,
  /late/i,
  /derogatory/i,
  /closed.*(negative|adverse)/i,
  /\d+\s*days?\s*(late|past)/i,
  /repossession/i,
  /foreclosure/i,
  /bankruptcy/i,
  /judgment/i,
  /settled.*less/i,
  /written.?off/i,
];

// Bureau detection patterns
const BUREAU_PATTERNS = {
  EXPERIAN: /experian/i,
  EQUIFAX: /equifax/i,
  TRANSUNION: /transunion|trans\s*union/i,
};

// Parse currency string to cents
function parseCurrency(str: string): number | undefined {
  const match = str.match(/\$?([\d,]+)(?:\.(\d{2}))?/);
  if (!match) return undefined;
  const dollars = parseInt(match[1].replace(/,/g, ''), 10);
  const cents = match[2] ? parseInt(match[2], 10) : 0;
  return dollars * 100 + cents;
}

// Parse date strings
function parseDate(str: string): Date | undefined {
  const formats = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{1,2})-(\d{1,2})-(\d{4})/, // MM-DD-YYYY
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/, // Month DD, YYYY
  ];
  
  for (const format of formats) {
    const match = str.match(format);
    if (match) {
      try {
        return new Date(str);
      } catch {
        continue;
      }
    }
  }
  return undefined;
}

// Detect account type from text
function detectAccountType(text: string): string | undefined {
  for (const [type, pattern] of Object.entries(ACCOUNT_TYPE_PATTERNS)) {
    if (pattern.test(text)) {
      return type;
    }
  }
  return undefined;
}

// Check if account has negative indicators
function isNegativeAccount(text: string): boolean {
  return NEGATIVE_INDICATORS.some(pattern => pattern.test(text));
}

// Detect bureau from text
function detectBureau(text: string): string | undefined {
  for (const [bureau, pattern] of Object.entries(BUREAU_PATTERNS)) {
    if (pattern.test(text)) {
      return bureau;
    }
  }
  return undefined;
}

// Extract account number (masked or partial)
function extractAccountNumber(text: string): string | undefined {
  // Look for patterns like XXXX1234, ****1234, ...1234
  const patterns = [
    /(?:account|acct)?\s*#?\s*[:.]?\s*([X*]+\d{4})/i,
    /(?:account|acct)?\s*#?\s*[:.]?\s*(\d{4,})/i,
    /ending\s+in\s+(\d{4})/i,
    /\.{3,}(\d{4})/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return undefined;
}

// Extract balance from text
function extractBalance(text: string): number | undefined {
  const patterns = [
    /(?:balance|current|owed)[\s:]+\$?([\d,]+(?:\.\d{2})?)/i,
    /\$\s*([\d,]+(?:\.\d{2})?)\s*(?:balance|owed)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseCurrency(match[1]);
    }
  }
  return undefined;
}

// Extract credit limit
function extractCreditLimit(text: string): number | undefined {
  const patterns = [
    /(?:credit\s*limit|limit)[\s:]+\$?([\d,]+(?:\.\d{2})?)/i,
    /\$\s*([\d,]+(?:\.\d{2})?)\s*limit/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseCurrency(match[1]);
    }
  }
  return undefined;
}

// Split text into account blocks
function splitIntoAccountBlocks(text: string): string[] {
  // Common patterns that indicate start of new account
  const accountSeparators = [
    /(?=\n[A-Z][A-Z\s&',.-]+\n(?:Account|Acct|Credit|Loan))/g,
    /(?=\n(?:Account|Acct)\s*#?\s*[:.]?\s*[X*\d])/gi,
    /(?=\n[A-Z]{2,}(?:\s+[A-Z]+){0,3}\s+(?:BANK|CREDIT|FINANCIAL|SERVICES|COLLECTION))/g,
  ];
  
  let blocks: string[] = [];
  
  // Try each separator pattern
  for (const separator of accountSeparators) {
    const parts = text.split(separator).filter(p => p.trim().length > 50);
    if (parts.length > blocks.length) {
      blocks = parts;
    }
  }
  
  // If no good splits, try paragraph-based splitting
  if (blocks.length < 2) {
    blocks = text.split(/\n{2,}/).filter(p => {
      const hasCreditorLike = /[A-Z]{2,}/.test(p);
      const hasAccountInfo = /(?:account|balance|credit|loan)/i.test(p);
      return p.trim().length > 100 && hasCreditorLike && hasAccountInfo;
    });
  }
  
  return blocks;
}

// Extract creditor name from account block
function extractCreditorName(text: string): string | undefined {
  // Look for company name at start of block
  const lines = text.trim().split('\n');
  
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    // Skip short lines or lines that are just labels
    if (line.length < 3 || /^(account|balance|credit|status)/i.test(line)) continue;
    
    // Look for capitalized company names
    if (/^[A-Z][A-Za-z\s&',.-]+$/.test(line) && line.length > 3 && line.length < 60) {
      return line;
    }
    
    // Look for company name patterns
    const companyMatch = line.match(/^([A-Z][A-Za-z\s&',.-]+(?:BANK|CREDIT|FINANCIAL|SERVICES|COLLECTION|CORP|INC|LLC)?)/i);
    if (companyMatch && companyMatch[1].length > 3) {
      return companyMatch[1].trim();
    }
  }
  
  return undefined;
}

// Main parsing function
export async function parseCreditReport(pdfBuffer: Buffer): Promise<ParseResult> {
  const data = await pdfParse(pdfBuffer);
  const text = data.text;
  
  const bureau = detectBureau(text);
  const accountBlocks = splitIntoAccountBlocks(text);
  
  const accounts: ParsedAccount[] = [];
  
  for (const block of accountBlocks) {
    const creditorName = extractCreditorName(block);
    if (!creditorName) continue;
    
    const account: ParsedAccount = {
      creditorName,
      accountNumber: extractAccountNumber(block),
      accountType: detectAccountType(block),
      isNegative: isNegativeAccount(block),
      balance: extractBalance(block),
      creditLimit: extractCreditLimit(block),
      rawText: block.substring(0, 1000), // Truncate for storage
    };
    
    accounts.push(account);
  }
  
  const negativeAccounts = accounts.filter(a => a.isNegative).length;
  
  return {
    bureau,
    accounts,
    totalAccounts: accounts.length,
    negativeAccounts,
  };
}

// Convert parsed accounts to database format
export function convertToDbAccounts(
  parsed: ParseResult,
  reportId: string,
  userId: string
): InsertCreditReportAccount[] {
  return parsed.accounts.map(account => ({
    reportId,
    userId,
    creditorName: account.creditorName,
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    accountStatus: account.accountStatus,
    paymentStatus: account.paymentStatus,
    isNegative: account.isNegative,
    balance: account.balance,
    creditLimit: account.creditLimit,
    highBalance: account.highBalance,
    monthlyPayment: account.monthlyPayment,
    dateOpened: account.dateOpened,
    lastReportedDate: account.lastReportedDate,
    rawText: account.rawText,
  }));
}
