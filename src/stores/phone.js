import { defineStore } from 'pinia';
import { usePlayerStore } from './player';
import appsData from '@/data/apps.json';
import { useConfigStore } from './config';
import { evaluateRequirement, evaluateDetailReveal } from '@/gameLogic/unlocks/unlocksEvaluator';
import config from '@/data/config.json';
import { createLogger } from '@/utils/loggers/loggerFactory';

const logger = createLogger('PhoneStore', '#38bdf8');

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
    terminalAdvanceSignal: 0,
    hasNewAppNotification: false,
  }),

  getters: {
    getAppState: () => (appId) => {
      const playerStore = usePlayerStore();

      if (playerStore.isFinalUnlockActive) {
        return { isUnlocked: true, areDetailsRevealed: true, meetsRequirements: true, isActivated: true };
      }

      if (playerStore.hasArchitectAwakened) {
        const appConfig = appsData.find(app => app.id === appId);
        const isTerminalApp = appId === 'terminal';
        
        return { 
          meetsRequirements: !!appConfig,
          isUnlocked: isTerminalApp,
          isActivated: playerStore.activatedApps.includes(appId) || isTerminalApp,
          areDetailsRevealed: true 
        };
      }

      if (config.allDataRevealed && !TERMINAL_FLOW_APPS.includes(appId)) {
        return { isUnlocked: true, areDetailsRevealed: true, meetsRequirements: true, isActivated: true };
      }

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

      return { isUnlocked, areDetailsRevealed, meetsRequirements, isActivated };
    },
  },

  actions: {
    setNewAppNotification() {
      this.hasNewAppNotification = true;
    },
    clearNewAppNotification() {
      this.hasNewAppNotification = false;
    },
    togglePhoneVisibility() {
      this.clearNewAppNotification();
      const configStore = useConfigStore();
      if (configStore.phoneOnly) {
        return; 
      }
      this.isPhoneVisible = !this.isPhoneVisible;
      // --- LOG ADICIONADO ---
      logger.log(`[ACTION] togglePhoneVisibility called. New state for isPhoneVisible: ${this.isPhoneVisible}`);
    },
    triggerTerminalAdvance() {
      logger.log('Sinal de avanço do terminal acionado.');
      this.terminalAdvanceSignal++;
    },
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
  },
});
