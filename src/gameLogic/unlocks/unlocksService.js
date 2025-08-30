import { evaluateRequirement } from './unlocksEvaluator';
import appsData from '@/data/apps.json';
import aisData from '@/data/ais.json';
import { usePlayerStore } from '@/stores/player';
import { usePhoneStore } from '@/stores/phone';
import { createLogger } from '@/utils/loggers/loggerFactory';

const logger = createLogger('UnlocksService', '#a855f7');

/**
 * Checks what new content (apps or AIs) is unlocked by the latest player action.
 * @returns {{type: string, name: string}[]} An array of unlocked items.
 */
export function getNewlyUnlockedContent() {
  const playerStore = usePlayerStore();
  const phoneStore = usePhoneStore();

  // Simulate the player's state *before* the last choice was made
  const previousPlayerState = {
    runCount: playerStore.runCount,
    choiceCount: playerStore.unlockedChoiceCount - 1,
    hasArchitectAwakened: playerStore.hasArchitectAwakened
  };
  
  const currentPlayerState = {
    runCount: playerStore.runCount,
    choiceCount: playerStore.unlockedChoiceCount,
    hasArchitectAwakened: playerStore.hasArchitectAwakened
  };

  const newlyUnlocked = [];

  const allUnlockables = [
    ...appsData.map(item => ({ ...item, unlockType: 'app' })),
    ...aisData.map(item => ({ ...item, unlockType: 'ai' }))
  ];

  for (const item of allUnlockables) {
    if (!item.requirementId) continue;

    // Check if it's already unlocked from a terminal activation
    const appState = phoneStore.getAppState(item.id);
    if (appState.isActivated) continue;

    const wasMetBefore = evaluateRequirement(item.requirementId, previousPlayerState);
    const isMetNow = evaluateRequirement(item.requirementId, currentPlayerState);

    if (!wasMetBefore && isMetNow) {
      logger.log(`New unlock detected: ${item.unlockType} - ${item.name || item.nome_br}`);
      newlyUnlocked.push({
        type: item.unlockType,
        name: item.name || item.nome_br,
      });
    }
  }
  
  return newlyUnlocked;
}
