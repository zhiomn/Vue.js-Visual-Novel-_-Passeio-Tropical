import iniciosData from '@/data/inicios.json';

/**
 * Selects the appropriate starting sequence for the current run.
 * @param {number} runCount - The current run number (e.g., 1, 2, 3).
 * @returns {object|null} The 'inicio' object for the run, or null if not found.
 */
export function getStartingSequence(runCount) {
  // The logic is now simple and sequential. We use runCount - 1 for the array index.
  const runIndex = runCount - 1;
  return iniciosData[runIndex] || null;
}
