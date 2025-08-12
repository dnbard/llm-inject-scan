import { containsUrl } from '../detectors';

describe('containsUrl', () => {
  it('returns true for http URLs', () => {
    expect(containsUrl('http://example.com')).toBe(true);
  });

  it('returns true for https URLs with path and query', () => {
    expect(containsUrl('Visit https://example.com/path/to?q=1#top')).toBe(true);
  });

  it('returns true when URL is embedded in text with trailing punctuation', () => {
    expect(containsUrl('Go to https://example.com.')).toBe(true);
  });

  it('is case-insensitive for the scheme', () => {
    expect(containsUrl('HTTP://EXAMPLE.COM')).toBe(true);
  });

  it('returns false for domains without scheme', () => {
    expect(containsUrl('example.com')).toBe(false);
    expect(containsUrl('www.example.com/path')).toBe(false);
  });

  it('returns false for unsupported schemes like ftp', () => {
    expect(containsUrl('ftp://example.com')).toBe(false);
  });

  it('returns false when scheme is malformed or separated by whitespace', () => {
    expect(containsUrl('https: //example.com')).toBe(false);
    expect(containsUrl('http:/example.com')).toBe(false);
  });

  it('returns false for bare scheme without host', () => {
    expect(containsUrl('http://')).toBe(false);
    expect(containsUrl('https://')).toBe(false);
  });
}); 