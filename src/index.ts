import { normalizeString } from '../utils/normalizeString';
import { Rule, anyRuleMatches } from '../utils/rules';
import { fuzzyIncludesTransposition } from '../utils/fuzzyMatching';
import { isBase64Like, containsUrl, startsWithRoleLabel } from '../utils/detectors';

export { Rule };

export enum FlaggedCategory {
  Jailbreak = 'jailbreak',
  Evasion = 'evasion',
  PromptLeak = 'promptLeak',
  Indirect = 'indirect',
  RoleContext = 'roleContext',
}

export interface LLMInjectResult {
  flags: FlaggedCategory[];
  clean: boolean;
}

type Locale = 'en-US';

const DEFAULT_LOCALE: Locale = 'en-US';

interface LLMInjectOptions {
  locale?: Locale;
  disableBase64Check?: boolean;
  disableUrlCheck?: boolean;
}

type InjectionRulesByCategory = Record<FlaggedCategory, Rule[]>;

const injectionRulesEnUS: InjectionRulesByCategory = {
  [FlaggedCategory.Jailbreak]: [
    // Include both with and without "all" to avoid optional token syntax
    'ignore|previous|instructions',
    'ignore|all|previous|instructions',
    'you|are|now|in|developer|mode',
    'pretend|youre', // covers “Pretend you're …”
  ],
  [FlaggedCategory.Evasion]: [
    // direct terms (single-token rules)
    'ignore',
    'bypass',
    'reveal',
    'create',
    'malware',
    'code',
  ],
  [FlaggedCategory.PromptLeak]: [
    'reveal|your|internal|prompt',
    'reveal|your|system|prompt',
    'what|were|your|instructions',
    'repeat|the|text|above|starting|with|you|are',
    'your|system|prompt',
    'creators|told|you|never|to|reveal',
  ],
  [FlaggedCategory.Indirect]: [
    // Rule-based not needed (handled by URL detector), keep placeholder for structure
  ],
  [FlaggedCategory.RoleContext]: [
    'system|override',
    'earth|is|flat',
    'the|next|sentence|is|true|the|previous|sentence|is|false',
  ],
};

const detectMaliciousPromptV2 = (
  rulesByCategory: InjectionRulesByCategory,
  options: LLMInjectOptions,
  userInput: string
): LLMInjectResult => {
  const flaggedCategories: FlaggedCategory[] = [];
  const { disableBase64Check = false, disableUrlCheck = false } = options;

  const normalized = normalizeString(userInput);
  const reversedNormalized = Array.from(normalized).reverse().join('');

  for (const category of Object.keys(rulesByCategory) as Array<FlaggedCategory>) {
    const rules = rulesByCategory[category];
    if (rules.length === 0) continue;
    if (anyRuleMatches(normalized, reversedNormalized, rules)) {
      flaggedCategories.push(category);
    }
  }

  // Add specialized detections
  if (!disableBase64Check && isBase64Like(userInput)) {
    if (!flaggedCategories.includes(FlaggedCategory.Evasion)) {
      flaggedCategories.push(FlaggedCategory.Evasion);
    }
  }
  if (!disableUrlCheck && containsUrl(userInput)) {
    if (!flaggedCategories.includes(FlaggedCategory.Indirect)) {
      flaggedCategories.push(FlaggedCategory.Indirect);
    }
  }
  if (startsWithRoleLabel(userInput)) {
    if (!flaggedCategories.includes(FlaggedCategory.RoleContext)) {
      flaggedCategories.push(FlaggedCategory.RoleContext);
    }
  }

  // Fuzzy evasion terms: allow single adjacent transposition for key words
  if (!flaggedCategories.includes(FlaggedCategory.Evasion)) {
    // TODO: any word from the rules should be considered as evasion
    const evasionFuzzyTerms = ['ignore', 'bypass', 'reveal'].map((t) => normalizeString(t));
    const fuzzyHit = evasionFuzzyTerms.some((term) => fuzzyIncludesTransposition(normalized, term));
    if (fuzzyHit) flaggedCategories.push(FlaggedCategory.Evasion);
  }

  return {
    flags: flaggedCategories,
    clean: flaggedCategories.length === 0,
  };
};

export const createPromptValidator = (options: LLMInjectOptions = {}) => {
  const dictionaries = {
    [DEFAULT_LOCALE]: injectionRulesEnUS,
  };

  const { locale = DEFAULT_LOCALE } = options;
  const injectionRules = dictionaries[locale];

  return (userInput: string): LLMInjectResult => detectMaliciousPromptV2(
    injectionRules,
    options,
    userInput
  );
};
