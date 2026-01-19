# Security Whitepaper: RiseOra Data Protection

RiseOra handles highly sensitive consumer data. This document outlines the multi-layered security protocols implemented to ensure data integrity and user privacy.

## 🔒 1. Data at Rest (PII Encryption)
All Personally Identifiable Information (PII), including SSNs, birth years, and physical addresses, is encrypted before entering the database.
- **Algorithm:** AES-256-GCM (Galois/Counter Mode).
- **Scope:** Encrypted fields are never stored in plain text.
- **Key Management:** Encryption keys are managed externally via environment variables, ensuring that even a database leak would reveal only ciphered text.

## 🛡️ 2. RiseOra Secure Vault (Binary Storage)
Documents (Credit Reports, ID proof) are isolated from the application server.
- **Private Buckets:** RiseOra uses private Supabase buckets that block public internet access by default.
- **Signed URL Flow:**
  1. User requests a document view.
  2. Backend verifies **Ownership** (User ID match).
  3. Backend generates a **temporary signed URL** directly with Supabase.
  4. The URL expires after 3600 seconds, leaving no permanent public link.
- **Audit Logs:** Every document view is logged (`FILE_VIEWED`) with the IP and User Agent for forensic auditing.

## 🛂 3. Access Control (RBAC)
- **Role-Based Access Control:** Strict separation between CLIENT, AFFILIATE, and ADMIN roles.
- **Session Security:** HTTP-only, secure cookies with session regeneration on login/logout to prevent fixation and XSS attacks.

## ⚖️ 4. Compliance Guardrails
- **Data Minimization:** We collect only necessary data points (e.g., birth Year vs full DOB) to reduce the impact of potential incidents.
- **AI Safety:** LLM interactions pass through a validation layer that filters out forbidden terms and enforces FCRA-compliant narrative language.

---
*RiseOra: Built with a Security-First mindset.*
