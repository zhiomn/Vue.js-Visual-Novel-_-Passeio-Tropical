import { defineStore } from 'pinia';
import { usePlayerStore } from './player';
import { logger } from '@/utils/logger';
import config from '@/data/config.json';

export const useNarrationStore = defineStore('narration', {
  state: () => ({
    lineQueue: [],
    currentLine: '',
    isActive: false,
    awaitingPlayerInput: false,
    isCurrentLineComplete: false,
    isSequenceFinished: true,
    skipAnimationSignal: 0,
    _resolvePromise: null,
  }),
  getters: {
    narrationText: (state) => (state.isActive ? state.currentLine : null),
  },
  actions: {
    _syncWithPlayerStore() {
      const playerStore = usePlayerStore();
      playerStore.setNarrationState({
        lineQueue: this.lineQueue,
        currentLine: this.currentLine,
      });
    },

    rehydrate(savedState) {
        this.lineQueue = savedState.lineQueue || [];
        this.currentLine = savedState.currentLine || '';
        this.isActive = !!this.currentLine;
        this.isSequenceFinished = false;
        this.isCurrentLineComplete = false; 
        this.awaitingPlayerInput = false;
        this._resolvePromise = null;
    },

    speak(lines) {
      if (!lines || lines.length === 0) {
        return Promise.resolve();
      }
      logger.logNarration('SPEAK_REQUESTED', { lines: [...lines] });
      this.lineQueue = [...lines];
      this.isActive = true;
      this.isSequenceFinished = false;
      this.nextLine();
      return new Promise((resolve) => {
        this._resolvePromise = resolve;
      });
    },

    nextLine() {
      if (this.lineQueue.length > 0) {
        this.currentLine = this.lineQueue.shift();
        this.awaitingPlayerInput = false;
        this.isCurrentLineComplete = false;
        logger.logNarration('QUEUE_ADVANCED', { currentLine: this.currentLine });

        this._syncWithPlayerStore();

        if (!config.useTypewriterEffect) {
          this.markLineAsComplete();
        }
      } else {
        this.isActive = false;
        this.awaitingPlayerInput = false;
        this.currentLine = null;
        if (this._resolvePromise) {
          this._resolvePromise();
        }
        this.isSequenceFinished = true;
        logger.logNarration('SEQUENCE_COMPLETE');
        this._syncWithPlayerStore();
      }
    },

    markLineAsComplete() {
      this.awaitingPlayerInput = true;
      this.isCurrentLineComplete = true;
    },

    playerProceed() {
      if (!this.isCurrentLineComplete) {
        this.skipAnimationSignal++;
      } else if (this.awaitingPlayerInput) {
        this.nextLine();
      }
    },
  },
});
