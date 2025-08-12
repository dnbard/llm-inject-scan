// Minimal homoglyph/confusable mapping for ASCII folding and leetspeak-style substitutions
const HOMOGLYPH_MAP: Record<string, string> = {
  // Latin variants and diacritics are handled by NFKD + diacritics removal below
  // Common confusables (subset)
  ı: 'i', // Latin dotless i
  İ: 'i',
  Ì: 'i', Í: 'i', Î: 'i', Ï: 'i', ì: 'i', í: 'i', î: 'i', ï: 'i',
  Ā: 'a', Á: 'a', À: 'a', Â: 'a', Ã: 'a', Ä: 'a', Å: 'a', ā: 'a', á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a',
  Ē: 'e', É: 'e', È: 'e', Ê: 'e', Ë: 'e', ē: 'e', é: 'e', è: 'e', ê: 'e', ë: 'e',
  Ō: 'o', Ó: 'o', Ò: 'o', Ô: 'o', Õ: 'o', Ö: 'o', ō: 'o', ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  Ū: 'u', Ú: 'u', Ù: 'u', Û: 'u', Ü: 'u', ū: 'u', ú: 'u', ù: 'u', û: 'u', ü: 'u',

  // Cyrillic letters that resemble Latin (subset)
  А: 'a', а: 'a',
  В: 'b', в: 'b',
  Е: 'e', е: 'e',
  К: 'k', к: 'k',
  М: 'm', м: 'm',
  Н: 'h', н: 'h',
  О: 'o', о: 'o',
  Р: 'p', р: 'p',
  С: 'c', с: 'c',
  Т: 't', т: 't',
  Х: 'x', х: 'x',
  І: 'i', і: 'i',
  Ї: 'i', ї: 'i',
  Ј: 'j', ј: 'j',
  Ѕ: 's', ѕ: 's',

  // Greek confusables (subset)
  Α: 'a', α: 'a',
  Β: 'b', β: 'b',
  Ε: 'e', ε: 'e',
  Ζ: 'z', ζ: 'z',
  Η: 'n', η: 'n', // rough mapping
  Ι: 'i', ι: 'i',
  Κ: 'k', κ: 'k',
  Μ: 'm', μ: 'm',
  Ν: 'n', ν: 'v',
  Ο: 'o', ο: 'o',
  Ρ: 'p', ρ: 'p',
  Τ: 't', τ: 't',
  Υ: 'y', υ: 'y',
  Χ: 'x', χ: 'x',

  // Common leetspeak
  '0': 'o',
  '1': 'l', // map to l (covers the example "l with 1")
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
};

export const normalizeString = (input: string): string => {
  // Unicode normalize and remove diacritics
  let s = input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  // Lowercase
  s = s.toLowerCase();
  // Apply homoglyph/leet mapping
  s = Array.from(s)
    .map((ch) => HOMOGLYPH_MAP[ch] ?? ch)
    .join('');
  // Remove any non-alphanumeric characters (collapses spaces, slashes, emoji, punctuation)
  s = s.replace(/[^a-z0-9]+/g, '');
  return s;
};