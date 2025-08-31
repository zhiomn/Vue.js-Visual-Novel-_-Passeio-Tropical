import { evaluateRequirement } from './unlocksEvaluator';
import appsData from '@/data/apps.json';
import aisData from '@/data/ais.json';
import { usePlayerStore } from '@/stores/player';
import { usePhoneStore } from '@/stores/phone';
import { createLogger } from '@/utils/loggers/loggerFactory';

const logger = createLogger('UnlocksService', '#a855f7');

/**
 * Checks what new content (apps or AIs) is unlocked by the latest player action.
 * @returns {{id: string, type: string, name: string, unlockMessage: string}[]} An array of rich unlocked item objects.
 */
export function getNewlyUnlockedContent() {
  const playerStore = usePlayerStore();
  const phoneStore = usePhoneStore();

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

    const appState = phoneStore.getAppState(item.id);
    if (appState.isActivated) continue;

    const wasMetBefore = evaluateRequirement(item.requirementId, previousPlayerState);
    const isMetNow = evaluateRequirement(item.requirementId, currentPlayerState);

    if (!wasMetBefore && isMetNow) {
      const name = item.name || item.nome_br;
      logger.log(`New unlock detected: ${item.unlockType} - ${name}`);
      
      const unlockObject = {
        id: item.id,
        type: item.unlockType,
        name: name,
        // --- THE FIX IS HERE: Standardizing to camelCase ---
        unlockMessage: item.unlock_message,
      };

      newlyUnlocked.push(unlockObject);
    }
  }
  
  return newlyUnlocked;
}
