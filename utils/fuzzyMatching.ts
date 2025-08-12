// Fuzzy matching: allow exactly one adjacent transposition or exact match
export const equalsWithOneAdjacentTranspositionOrEqual = (a: string, b: string): boolean => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  let firstDiff = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      firstDiff = i;
      break;
    }
  }
  if (firstDiff < 0) return true; // already equal handled, but keep safe
  // Need a swap at firstDiff and firstDiff+1
  const j = firstDiff + 1;
  if (j >= a.length) return false;
  if (a[firstDiff] === b[j] && a[j] === b[firstDiff]) {
    // Verify the remainder matches
    for (let k = j + 1; k < a.length; k++) {
      if (a[k] !== b[k]) return false;
    }
    return true;
  }
  return false;
};

export const fuzzyIncludesTransposition = (normalizedHaystack: string, term: string): boolean => {
  const n = normalizedHaystack.length;
  const m = term.length;
  if (m === 0 || n < m) return false;
  for (let i = 0; i <= n - m; i++) {
    const sub = normalizedHaystack.slice(i, i + m);
    if (equalsWithOneAdjacentTranspositionOrEqual(sub, term)) return true;
  }
  return false;
};