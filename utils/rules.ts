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

export const containsRuleIn = (normalizedHaystack: string, rule: Rule): boolean => {
  const needle = ruleToNeedle(rule);
  if (!needle) return false;
  return normalizedHaystack.includes(needle);
};

export const anyRuleMatches = (normalized: string, reversedNormalized: string, rules: Rule[]): boolean => {
  return rules.some((rule) => containsRuleIn(normalized, rule) || containsRuleIn(reversedNormalized, rule));
};