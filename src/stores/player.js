import { defineStore } from 'pinia';
import { useConfigStore } from './config';
import { useReadStatusStore } from './readStatus';
import config from '@/data/config.json';
import escolhasData from '@/data/escolhas.json';
import { createLogger } from '@/utils/loggers/loggerFactory';

const logger = createLogger('PlayerStore', '#f59e0b');

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isReady: false,
    hasArchitectAwakened: false,
    activatedApps: [],
    unlockedEscolhaIds: [],
    runCount: 0,
    // --- NOVOS ESTADOS PERSISTENTES ---
    gamePhase: 'IDLE',
    lastSceneName: null,
  }),
  getters: {
    isGameComplete(state) {
      const configStore = useConfigStore();
      if (config.allDataRevealed) return true;
      return state.runCount > configStore.totalRuns;
    },
    isChoiceUnlocked: (state) => (escolhaId) => {
      if (config.allDataRevealed) return true;
      return state.unlockedEscolhaIds?.includes(escolhaId) ?? false;
    },
    unlockedChoiceCount: (state) => {
      if (config.allDataRevealed) return escolhasData.length;
      return state.unlockedEscolhaIds?.length ?? 0;
    },
  },
  actions: {
    addActivatedApp(appId) {
      if (!this.activatedApps.includes(appId)) {
        this.activatedApps.push(appId);
        logger.log(`App Ativado: ${appId}`);
      }
    },
    awakenArchitect() {
      if (!this.hasArchitectAwakened) {
        this.hasArchitectAwakened = true;
      }
    },
    unlockChoice(escolhaId) {
      if (!this.unlockedEscolhaIds.includes(escolhaId)) {
        this.unlockedEscolhaIds.push(escolhaId);
      }
    },
    startNewRun() {
      if (config.allDataRevealed) return;
      this.runCount++;
      // --- Redefinir o estado da run para o início de uma nova run ---
      this.gamePhase = 'STARTING';
      this.lastSceneName = null;
    },
    saveProgress() {
      if (config.allDataRevealed) {
        logger.warn('Salvamento de progresso bloqueado: allDataRevealed está ativo.');
        return;
      }
      localStorage.setItem('game_player_progress', JSON.stringify(this.$state));
      logger.log('Progresso salvo no LocalStorage.', this.$state);
    },
    loadProgress() {
      if (config.allDataRevealed) {
        logger.log('MODO DEV: Simulando um estado de jogo completo.');
        this.unlockedEscolhaIds = escolhasData.map(e => e.id);
        this.runCount = config.totalRuns;
        const readStatusStore = useReadStatusStore();
        readStatusStore.markAllAsRead();
      } else {
        const savedProgress = localStorage.getItem('game_player_progress');
        if (savedProgress) {
          this.$patch(JSON.parse(savedProgress));
          logger.log('Progresso do jogador carregado do LocalStorage.');
        }
      }
      this.isReady = true;
    },
    resetGame() {
      const readStatusStore = useReadStatusStore();
      localStorage.removeItem('game_player_progress');
      localStorage.removeItem('game_read_status');
      this.$reset();
      readStatusStore.$reset();
      logger.warn('[FERRAMENTA DEV] O estado do jogo foi redefinido. Recarregando a página...');
      location.reload();
    }
  }
});
