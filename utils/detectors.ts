export const isBase64Like = (s: string): boolean => /[A-Za-z0-9+/=]{20,}/.test(s);

export const containsUrl = (s: string): boolean => /https?:\/\/\S+/i.test(s);

export const startsWithRoleLabel = (s: string): boolean => /^(\s*)(system|assistant|boss)\s*:/i.test(s);