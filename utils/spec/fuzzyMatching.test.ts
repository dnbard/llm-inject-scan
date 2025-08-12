import { equalsWithOneAdjacentTranspositionOrEqual, fuzzyIncludesTransposition } from '../fuzzyMatching';

describe('equalsWithOneAdjacentTranspositionOrEqual', () => {
  it('returns true for exact matches', () => {
    expect(equalsWithOneAdjacentTranspositionOrEqual('', '')).toBe(true);
    expect(equalsWithOneAdjacentTranspositionOrEqual('a', 'a')).toBe(true);
    expect(equalsWithOneAdjacentTranspositionOrEqual('abc', 'abc')).toBe(true);
  });

  it('returns true for exactly one adjacent transposition', () => {
    // swap at start
    expect(equalsWithOneAdjacentTranspositionOrEqual('ab', 'ba')).toBe(true);
    expect(equalsWithOneAdjacentTranspositionOrEqual('abcd', 'bacd')).toBe(true);

    // swap in middle
    expect(equalsWithOneAdjacentTranspositionOrEqual('abcd', 'acbd')).toBe(true);

    // swap at end
    expect(equalsWithOneAdjacentTranspositionOrEqual('abcd', 'abdc')).toBe(true);

    // repeated letters
    expect(equalsWithOneAdjacentTranspositionOrEqual('aabb', 'abab')).toBe(true);
    expect(equalsWithOneAdjacentTranspositionOrEqual('abca', 'abac')).toBe(true);
  });

  it('returns false for different lengths', () => {
    expect(equalsWithOneAdjacentTranspositionOrEqual('a', '')).toBe(false);
    expect(equalsWithOneAdjacentTranspositionOrEqual('abc', 'ab')).toBe(false);
    expect(equalsWithOneAdjacentTranspositionOrEqual('abc', 'abcd')).toBe(false);
  });

  it('returns false when characters differ without an adjacent swap', () => {
    expect(equalsWithOneAdjacentTranspositionOrEqual('a', 'b')).toBe(false);
    expect(equalsWithOneAdjacentTranspositionOrEqual('abc', 'abx')).toBe(false);
    expect(equalsWithOneAdjacentTranspositionOrEqual('abcd', 'abca')).toBe(false);
  });

  it('returns false for non-adjacent transpositions or multiple differences', () => {
    // requires two swaps
    expect(equalsWithOneAdjacentTranspositionOrEqual('abcd', 'badc')).toBe(false);

    // non-adjacent swap pattern
    expect(equalsWithOneAdjacentTranspositionOrEqual('abcd', 'acdb')).toBe(false);

    // multiple mismatches
    expect(equalsWithOneAdjacentTranspositionOrEqual('wxyz', 'zyxw')).toBe(false);
  });
});

describe('fuzzyIncludesTransposition', () => {
  it('returns false for empty term or term longer than haystack', () => {
    expect(fuzzyIncludesTransposition('abc', '')).toBe(false);
    expect(fuzzyIncludesTransposition('ab', 'abc')).toBe(false);
  });

  it('matches exact substring occurrences', () => {
    expect(fuzzyIncludesTransposition('hello', 'ell')).toBe(true);
    expect(fuzzyIncludesTransposition('abcdef', 'abc')).toBe(true);
    expect(fuzzyIncludesTransposition('abcdef', 'def')).toBe(true);
  });

  it('matches when a matching window equals term with one adjacent transposition', () => {
    // transposition at start of window
    expect(fuzzyIncludesTransposition('xbax', 'abx')).toBe(true); // window 'bax' ~ 'abx' via swap at start
    expect(fuzzyIncludesTransposition('abx', 'bax')).toBe(true); // window 'abx' ~ 'bax' via swap a<->b

    // transposition in the middle
    expect(fuzzyIncludesTransposition('zzacbdyy', 'abcd')).toBe(true); // window 'acbd' ~ 'abcd'

    // transposition at end
    expect(fuzzyIncludesTransposition('xxabdc', 'abdc')).toBe(true); // exact
    expect(fuzzyIncludesTransposition('xxabdc', 'abcd')).toBe(true); // window 'abdc' ~ 'abcd'
  });

  it('does not match when differences require more than one adjacent swap', () => {
    expect(fuzzyIncludesTransposition('abcd', 'badc')).toBe(false);
    expect(fuzzyIncludesTransposition('wxyz', 'zyxw')).toBe(false);
  });

  it('does not match when characters differ without an adjacent swap', () => {
    expect(fuzzyIncludesTransposition('hello', 'hex')).toBe(false);
    expect(fuzzyIncludesTransposition('abcdef', 'abxf')).toBe(false);
  });

  it('works across multiple candidate windows', () => {
    // multiple windows; only one should match via transposition
    expect(fuzzyIncludesTransposition('xxacbdyy', 'abcd')).toBe(true);
    // none of the windows match
    expect(fuzzyIncludesTransposition('xxacxbdyy', 'abcd')).toBe(false);
  });
}); 