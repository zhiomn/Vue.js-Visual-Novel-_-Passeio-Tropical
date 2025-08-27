import config from '@/data/config.json';
import requirements from '@/data/requirements.json';

/**
 * A pure, stateless service for evaluating unlock conditions from the central requirements library.
 */

/**
 * Evaluates a specific requirement pack against the player's current state.
 * @param {string} requirementId - The ID of the requirement pack from requirements.json.
 * @param {object} playerState - The current state of the player's progress.
 * @returns {boolean} - True if all conditions in the pack are met, otherwise false.
 */
export function evaluateRequirement(requirementId, playerState) {
  if (config.allDataRevealed) return true;
  if (!requirementId) return true; // No requirement means it's met.

  const requirementPack = requirements[requirementId];
  if (!requirementPack) {
    console.warn(`[unlocksEvaluator] Unknown requirementId: ${requirementId}`);
    return false;
  }

  // Check every condition in the pack. All must be true.
  for (const conditionKey in requirementPack) {
    const requiredValue = requirementPack[conditionKey];

    switch (conditionKey) {
      case 'runRequired':
        if (playerState.runCount < requiredValue) return false;
        break;
      case 'app': // This is the choice count
        if (playerState.choiceCount < requiredValue) return false;
        break;
      case 'trigger':
        if (requiredValue === 'ARCHITECT_AWAKENED' && !playerState.hasArchitectAwakened) {
          return false;
        }
        break;
      case 'description':
        // The description is for humans, ignore it in evaluation.
        break;
      default:
        console.warn(`[unlocksEvaluator] Unknown condition key: ${conditionKey}`);
        return false;
    }
  }

  return true; // If we get here, all conditions passed.
}

/**
 * Evaluates if details for an item should be revealed.
 * This logic is separate and can be refactored later if needed.
 */
export function evaluateDetailReveal(conditions, playerState) {
  if (config.allDataRevealed) return true;
  
  if (!conditions) return false;
  
  const requiredChoices = conditions.revealDetails ?? Infinity;
  return playerState.choiceCount >= requiredChoices;
}
