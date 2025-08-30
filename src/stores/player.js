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
    isFinalUnlockActive: false,
    isGameFinished: false,
    activatedApps: [],
    unlockedEscolhaIds: [],
    runCount: 0,
    gamePhase: 'IDLE',
    lastSceneName: null,
    narrationState: {
      lineQueue: [],
      currentLine: '',
    },
    awaitingTravelPrompt: false,
    visitedScenesInThisRun: [],
  }),
  getters: {
    isGameComplete(state) {
      const configStore = useConfigStore();
      if (config.allDataRevealed) return true;
      // THE FIX IS HERE: Changed > to >=
      return state.runCount >= configStore.totalRuns;
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
    finishGame() {
      if (!this.isGameFinished) {
        this.isGameFinished = true;
        this.saveProgress();
        logger.log('O jogo foi marcado como finalizado.');
      }
    },
    addVisitedScene(sceneName) {
      if (!this.visitedScenesInThisRun.includes(sceneName)) {
        this.visitedScenesInThisRun.push(sceneName);
        this.saveProgress();
      }
    },
    setNarrationState({ lineQueue, currentLine }) {
      this.narrationState.lineQueue = lineQueue;
      this.narrationState.currentLine = currentLine;
      this.saveProgress();
    },
    addActivatedApp(appId) {
      if (!this.activatedApps.includes(appId)) {
        this.activatedApps.push(appId);
        logger.log(`App Ativado: ${appId}`);
        this.saveProgress();
      }
    },
    awakenArchitect() {
      if (!this.hasArchitectAwakened) {
        this.hasArchitectAwakened = true;
        logger.log('O Arquiteto despertou. O estado do jogo mudou.');
        this.saveProgress();
      }
    },
    setFinalUnlockState() {
      if (!this.isFinalUnlockActive) {
        this.isFinalUnlockActive = true;
        logger.log('DESBLOQUEIO FINAL ATIVADO. Todos os sistemas estão agora abertos.');
        this.saveProgress();
      }
    },
    unlockChoice(escolhaId) {
      if (!this.unlockedEscolhaIds.includes(escolhaId)) {
        this.unlockedEscolhaIds.push(escolhaId);
        this.saveProgress();
      }
    },
    startNewRun() {
      if (config.allDataRevealed) return;
      this.runCount++;
      this.gamePhase = 'STARTING';
      this.lastSceneName = null;
      this.narrationState = { lineQueue: [], currentLine: '' };
      this.awaitingTravelPrompt = false;
      this.visitedScenesInThisRun = [];
      this.saveProgress();
    },
    saveProgress() {
      if (config.allDataRevealed) {
        logger.warn('Salvamento de progresso bloqueado: allDataRevealed está ativo.');
        return;
      }
      localStorage.setItem('game_player_progress', JSON.stringify(this.$state));
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
