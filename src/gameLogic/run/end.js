import { jsonDbService } from '@/services/jsonDbService';

/**
 * Selects the appropriate ending sequence for the completed run.
 * @param {number} completedRunCount - The run number that was just finished.
 * @returns {object|null} The 'final' object for the run, or null if not found.
 */
export function getEndingSequence(completedRunCount) {
  return jsonDbService.getEndingSequenceByRun(completedRunCount);
}
