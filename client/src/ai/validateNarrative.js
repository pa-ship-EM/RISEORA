import { AI_GUARDRAILS } from "./guardrails";

/**
 * Validates a dispute narrative against the AI guardrails.
 * Enforces content policies, length limits, and professional tone.
 * 
 * @param {string} text - The narrative text to validate
 * @returns {object} Result object { isValid: boolean, errors: string[], warnings: string[] }
 */
export function validateNarrative(text) {
  const errors = [];
  const warnings = [];
  
  if (!text || typeof text !== 'string') {
    return { isValid: false, errors: ["Narrative cannot be empty"], warnings: [] };
  }

  const lowerText = text.toLowerCase();

  // 1. Check Max Length
  if (text.length > AI_GUARDRAILS.maxLength) {
    errors.push(`Narrative is too long. Maximum ${AI_GUARDRAILS.maxLength} characters allowed.`);
  }

  // 2. Check Forbidden Terms (Aggressive/Litigious Language)
  const foundForbidden = AI_GUARDRAILS.forbiddenTerms.filter(term => 
    lowerText.includes(term.toLowerCase())
  );

  if (foundForbidden.length > 0) {
    errors.push(
      `Narrative contains forbidden language: "${foundForbidden.join('", "')}". Please maintain a neutral, professional tone (avoid threats, legal demands, or "guarantees").`
    );
  }

  // 3. Check Tone (Heuristic: excessive caps)
  const upperCaseRatio = text.replace(/[^A-Z]/g, "").length / text.length;
  if (text.length > 20 && upperCaseRatio > 0.4) {
    warnings.push("Narrative appears to use excessive capitalization. Please use standard sentence case for a professional tone.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
