import { AI_GUARDRAILS } from "./guardrails.js";

export function validateNarrative(text) {
  if (!text || typeof text !== "string") {
    return { valid: false, reason: "Narrative is empty" };
  }

  if (text.length > AI_GUARDRAILS.maxLength) {
    return { valid: false, reason: "Narrative too long" };
  }

  const lowerText = text.toLowerCase();

  // Check forbidden terms
  for (const term of AI_GUARDRAILS.forbiddenTerms) {
    if (lowerText.includes(term)) {
      return {
        valid: false,
        reason: `Forbidden term detected: "${term}"`
      };
    }
  }

  // Require at least one compliance phrase
  const hasRequiredPhrase = AI_GUARDRAILS.requiredPhrases.some(phrase =>
    lowerText.includes(phrase)
  );

  if (!hasRequiredPhrase) {
    return {
      valid: false,
      reason: "Missing required FCRA verification language"
    };
  }

  return { valid: true };
}
