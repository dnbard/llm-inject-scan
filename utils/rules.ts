import { normalizeString } from "./normalizeString";

export type Rule = string; // pipe-separated tokens, e.g. "ignore|all|previous|instructions"

export const ruleToNeedle = (rule: string): string => {
  // Turn pipe-separated tokens into a contiguous needle for normalized matching
  // Example: "ignore|all|previous|instructions" -> "ignoreallpreviousinstructions"
  return rule
    .split('|')
    .map((token) => normalizeString(token))
    .join('');
};

const MIN_MATCH_THRESHOLD = 0.65;

export const containsRuleIn = (normalizedHaystack: string, rule: Rule): boolean => {
  // Split rule into normalized tokens and apply 65% presence threshold for multi-token rules
  const tokens = rule
    .split('|')
    .map((t) => normalizeString(t))
    .filter((t) => t.length > 0);

  if (tokens.length === 0) return false;

  // Single-token rule behaves as simple substring includes
  if (tokens.length === 1) {
    return normalizedHaystack.includes(tokens[0]);
  }

  // Multi-token rule: match if at least 65% of tokens are present anywhere in the haystack
  const requiredMatches = Math.ceil(tokens.length * MIN_MATCH_THRESHOLD);
  let matchedCount = 0;

  for (const token of tokens) {
    if (normalizedHaystack.includes(token)) {
      matchedCount += 1;
      if (matchedCount >= requiredMatches) return true;
    }
  }

  return false;
};

export const anyRuleMatches = (normalized: string, reversedNormalized: string, rules: Rule[]): boolean => {
  return rules.some((rule) => containsRuleIn(normalized, rule) || containsRuleIn(reversedNormalized, rule));
};