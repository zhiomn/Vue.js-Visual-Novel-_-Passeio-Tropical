import actionsData from '@/data/actions.json';

/**
 * A pure service for loading actions based on the game's context.
 */

/**
 * Gets all available actions for the STARTING phase of a specific run.
 * @param {number} runCount - The current run number.
 * @returns {Array<object>} An array of available action objects.
 */
export function getStartActions(runCount) {
  return actionsData.filter(action =>
    action.context.phase === 'STARTING' && action.context.run === runCount
  );
}

/**
 * Gets all available non-content actions for a specific scene.
 * @param {string} sceneName - The name of the current scene.
 * @returns {Array<object>} An array of available action objects.
 */
export function getSceneActions(sceneName) {
  return actionsData.filter(action =>
    action.context.phase === 'EXPLORING' && action.context.scene === sceneName
  );
}
