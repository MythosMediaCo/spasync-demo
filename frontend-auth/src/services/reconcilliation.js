// /services/reconciliation.js
const stringSimilarity = require('string-similarity');

function normalize(str) {
  return str?.toString().trim().toLowerCase();
}

function fuzzyMatch(row, dataset, keys, threshold = 0.85) {
  const target = keys.map(k => normalize(row[k])).join(' ');
  let bestMatch = null;
  let highestScore = 0;

  for (const candidate of dataset) {
    const candidateStr = keys.map(k => normalize(candidate[k])).join(' ');
    const score = stringSimilarity.compareTwoStrings(target, candidateStr);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = candidate;
    }
  }

  return highestScore >= threshold ? { match: bestMatch, score: highestScore } : null;
}

function reconcileFiles({ posTransactions = [], alleRewards = [], aspireCertificates = [] }) {
  const results = {
    matched: [],
    unmatched: [],
    conflicts: []
  };

  for (const posRow of posTransactions) {
    const alle = fuzzyMatch(posRow, alleRewards, ['clientName', 'date', 'amount']);
    const aspire = fuzzyMatch(posRow, aspireCertificates, ['clientName', 'date', 'amount']);

    const matches = [alle?.match, aspire?.match].filter(Boolean);

    if (matches.length === 2 && JSON.stringify(alle.match) !== JSON.stringify(aspire.match)) {
      results.conflicts.push({ pos: posRow, alle: alle.match, aspire: aspire.match });
    } else if (matches.length === 1) {
      results.matched.push({ pos: posRow, match: matches[0] });
    } else {
      results.unmatched.push(posRow);
    }
  }

  return results;
}

module.exports = {
  reconcileFiles
};
