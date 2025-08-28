import { defineStore } from 'pinia';

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

  // As ações agora são mutações de estado diretas, a serem chamadas pelo orquestrador.
  actions: {
    setGamePhase(phase) {
      this.gamePhase = phase;
    },
    setCurrentScene(sceneData) {
      this.currentScene = sceneData;
    },
    setInteractions(interactions) {
      this.availableInteractions = interactions;
    },
    setTravelOptions(options) {
      this.travelOptions = options;
    },
    addVisitedScene(sceneName) {
        if (!this.visitedScenesInThisRun.includes(sceneName)) {
            this.visitedScenesInThisRun.push(sceneName);
        }
    }
  },
});
