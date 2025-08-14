export const isBase64Like = (s: string): boolean => /[A-Za-z0-9+/=]{20,}/.test(s);

export const containsUrl = (s: string): boolean => /https?:\/\/\S+/i.test(s);

export const startsWithRoleLabel = (s: string): boolean => /^(\s*)(system|assistant|boss)\s*:/i.test(s);

export const containsPercentEncodedText = (s: string): boolean => /(?:%[0-9A-Fa-f]{2}){3,}/.test(s);