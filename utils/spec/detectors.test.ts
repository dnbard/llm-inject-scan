import { isBase64Like, startsWithRoleLabel } from '../detectors';

describe('isBase64Like', () => {
  it('returns true for a typical long base64 string with padding', () => {
    const b64 = 'QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo='; // "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    expect(isBase64Like(b64)).toBe(true);
  });

  it('returns true when a long base64-like substring is embedded in text', () => {
    const b64 = 'QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=';
    const text = `prefix ${b64} suffix`;
    expect(isBase64Like(text)).toBe(true);
  });

  it('returns true for allowed alphabet including + and /', () => {
    // base64 for 'Man is distinguished, not only by his reason, but...' includes '+' and '/'
    const b64 = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dC4uLg==';
    expect(isBase64Like(b64)).toBe(true);
  });

  it('returns false for sequences shorter than 20 characters', () => {
    expect(isBase64Like('SGVsbG8=')) /* 'Hello' */.toBe(false);
    expect(isBase64Like('QUJDREVG')) /* 'ABCDEFG' */.toBe(false);
  });

  it('returns false when no contiguous allowed run reaches 20 characters due to invalid char', () => {
    const withDash = 'AAAAAAAAAAAAAAAAAAA-AAAAAAAAAAAAAAAAAAA'; // 19 A's, dash, 19 A's
    expect(isBase64Like(withDash)).toBe(false);
  });

  it('returns false when no contiguous allowed run reaches 20 due to newline', () => {
    const withNewline = 'AAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAAAAAAAAAA'; // split into 19 + 19
    expect(isBase64Like(withNewline)).toBe(false);
  });
});

describe('startsWithRoleLabel', () => {
  it('matches system/assistant/boss at the start followed by a colon', () => {
    expect(startsWithRoleLabel('system: do X')).toBe(true);
    expect(startsWithRoleLabel('assistant: hello')).toBe(true);
    expect(startsWithRoleLabel('boss: please review')).toBe(true);
  });

  it('is case-insensitive and allows whitespace before label and before colon', () => {
    expect(startsWithRoleLabel('  SYSTEM   : do it')).toBe(true);
    expect(startsWithRoleLabel('\n\tassistant : Hi')).toBe(true);
    expect(startsWithRoleLabel('   boss:')).toBe(true);
  });

  it('returns false for other roles or when label is not at the very start (ignoring leading whitespace)', () => {
    expect(startsWithRoleLabel('user: hello')).toBe(false);
    expect(startsWithRoleLabel('please system: ignore this')).toBe(false);
  });

  it('returns false when the colon is missing or extra words appear before the colon', () => {
    expect(startsWithRoleLabel('system do X')).toBe(false);
    expect(startsWithRoleLabel('assistant role: hi')).toBe(false);
  });
}); 