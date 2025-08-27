import { defineStore } from 'pinia';
import { 
    handleResumeGameSession,
    handleStartNextRun,
    handleTravelToScene,
    handleSelectChoice,
    handleExecuteAction,
} from '@/services/runOrchestrator';
import { useDisplayStore } from './useDisplayStore';

export const useRunStore = defineStore('run', {
  state: () => ({
    gamePhase: 'IDLE',
    currentScene: null,
    availableInteractions: { choices: [], actions: [] },
    visitedScenesInThisRun: [],
    travelOptions: [],
    isFinalEnding: false,
  }),

  getters: {
    backgroundUrl: (state) => {
        if (state.currentScene?.imagem) {
            return `./assets/images/backgrounds/${state.currentScene.imagem}`;
        }
        return null;
    },
  },

  actions: {
    // --- THE ARCHITECTURAL FIX IS HERE: Every user-initiated async flow is now locked at the store level ---
    resumeGameSession() {
      handleResumeGameSession();
    },
    
    startNextRun() {
      const displayStore = useDisplayStore();
      displayStore.withInputLock(handleStartNextRun);
    },

    travelToScene(sceneName) {
      const displayStore = useDisplayStore();
      displayStore.withInputLock(() => handleTravelToScene(sceneName));
    },

    selectChoice(escolhaId) {
      const displayStore = useDisplayStore();
      displayStore.withInputLock(() => handleSelectChoice(escolhaId));
    },

    executeAction(action) {
      const displayStore = useDisplayStore();
      displayStore.withInputLock(() => handleExecuteAction(action));
    },
  },
});
