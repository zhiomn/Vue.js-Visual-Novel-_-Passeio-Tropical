import { defineStore } from 'pinia';
import { usePlayerStore } from './player';
import appsData from '@/data/apps.json';
import { useConfigStore } from './config';
import { evaluateRequirement, evaluateDetailReveal } from '@/gameLogic/unlocks/unlocksEvaluator';
import config from '@/data/config.json';

// --- THE NEW LOGIC: A list of apps to exclude from the allDataRevealed override ---
const TERMINAL_FLOW_APPS = [
  'terminal',
  'contacts',
  'map',
  'audio',
  'ereader',
  'despertador',
  'video',
  'info'
];

export const usePhoneStore = defineStore('phone', {
  state: () => ({
    isPhoneVisible: false,
    activeApp: null,
  }),

  getters: {
    getAppState: () => (appId) => {
      // --- THE FIX IS HERE ---
      // This guard clause now checks if allDataRevealed is true AND the app is NOT in our exception list.
      if (config.allDataRevealed && !TERMINAL_FLOW_APPS.includes(appId)) {
        return { isUnlocked: true, areDetailsRevealed: true, meetsRequirements: true, isActivated: true };
      }

      // If allDataRevealed is false OR if the app is part of the terminal flow,
      // the original, complete game logic is executed.
      const playerStore = usePlayerStore();
      const appConfig = appsData.find(app => app.id === appId);

      if (!appConfig) {
        return { isUnlocked: false, areDetailsRevealed: false, meetsRequirements: false, isActivated: false };
      }

      const playerState = {
        runCount: playerStore.runCount,
        choiceCount: playerStore.unlockedChoiceCount,
        hasArchitectAwakened: playerStore.hasArchitectAwakened,
        activatedApps: playerStore.activatedApps,
      };

      const meetsRequirements = evaluateRequirement(appConfig.requirementId, playerState);
      const needsActivation = appConfig.requiresTerminalUnlock || false;
      const isActivated = playerStore.activatedApps.includes(appConfig.id);
      
      const isUnlocked = meetsRequirements && (!needsActivation || isActivated);
      
      const areDetailsRevealed = evaluateDetailReveal(appConfig.unlocks, playerState);

      return {
        isUnlocked,
        areDetailsRevealed,
        meetsRequirements,
        isActivated,
      };
    },
  },

  actions: {
    activateApp(appId) {
      const playerStore = usePlayerStore();
      playerStore.addActivatedApp(appId);
      this.activeApp = appId;
    },

    openApp(appName) {
      this.activeApp = appName;
    },
    closeApp() {
      this.activeApp = null;
    },
    togglePhoneVisibility() {
     const configStore = useConfigStore();
      if (configStore.phoneOnly) {
        return; 
      }
      this.isPhoneVisible = !this.isPhoneVisible;
    },
  },
});
