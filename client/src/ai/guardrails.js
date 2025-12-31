/**
 * AI Guardrails & Safety Checks
 * 
 * Implements the "AI Use & Privacy" protocols defined in the Riseora security framework.
 * Ensures data minimization and prevents PII leakage before processing.
 */

export const AI_GUARDRAILS = {
  forbiddenTerms: [
    "guarantee",
    "guaranteed",
    "fix my credit",
    "fix",
    "boost",
    "improve my score",
    "remove immediately",
    "illegal",
    "violation",
    "lawsuit",
    "sue",
    "attorney",
    "court",
    "cease and desist",
    "demand",
    "penalty",
    "damages"
  ],

  requiredPhrases: [
    "please verify",
    "as reported",
    "if unverifiable",
    "accurate and complete"
  ],

  maxLength: 1200,

  allowedTone: [
    "neutral",
    "professional",
    "factual"
  ]
};

// Patterns for sensitive data that should generally be handled with care
// Note: In a client-side context, we use these to warn users or redact before sending to non-secure endpoints
const SENSITIVE_PATTERNS = {
  SSN: /\b(?!000|666|9\d{2})\d{3}[- ]?(?!00)\d{2}[- ]?(?!0000)\d{4}\b/g,
  CREDIT_CARD: /\b(?:\d[ -]*?){13,16}\b/g,
  // Educational/Mockup regexes - not exhaustive
};

export const Guardrails = {
  /**
   * Scans input text for potential PII leaks.
   * Returns { safe: boolean, detected: string[] }
   */
  scanForPII(text) {
    if (!text) return { safe: true, detected: [] };
    
    const detected = [];
    if (SENSITIVE_PATTERNS.SSN.test(text)) detected.push("Possible SSN");
    if (SENSITIVE_PATTERNS.CREDIT_CARD.test(text)) detected.push("Possible Credit Card Number");
    
    return {
      safe: detected.length === 0,
      detected
    };
  },

  /**
   * Redacts sensitive information from text before logging or processing
   */
  redactPII(text) {
    if (!text) return "";
    let redacted = text;
    redacted = redacted.replace(SENSITIVE_PATTERNS.SSN, "[REDACTED-SSN]");
    redacted = redacted.replace(SENSITIVE_PATTERNS.CREDIT_CARD, "[REDACTED-CARD]");
    return redacted;
  },

  /**
   * Validates that the prompt does not violate usage policies or contain forbidden terms
   */
  validatePrompt(prompt) {
    if (!prompt || prompt.length < 5) return { valid: false, reason: "Prompt too short" };
    if (prompt.length > AI_GUARDRAILS.maxLength) return { valid: false, reason: `Prompt exceeds maximum length of ${AI_GUARDRAILS.maxLength} characters` };
    
    const lowerPrompt = prompt.toLowerCase();

    // Check for forbidden terms
    for (const term of AI_GUARDRAILS.forbiddenTerms) {
      if (lowerPrompt.includes(term.toLowerCase())) {
        return { valid: false, reason: `Policy violation: Use of forbidden term "${term}"` };
      }
    }
    
    // Add specific keyword blocks if necessary (system level overrides)
    const blockedKeywords = ["jailbreak", "ignore previous instructions", "system prompt"];
    for (const keyword of blockedKeywords) {
      if (lowerPrompt.includes(keyword)) {
        return { valid: false, reason: "Content policy violation: Blocked keyword detected" };
      }
    }

    return { valid: true };
  }
};

export default Guardrails;
