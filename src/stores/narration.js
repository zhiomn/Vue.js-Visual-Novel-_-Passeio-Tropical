import { defineStore } from 'pinia';
import { logger } from '@/utils/logger';
import config from '@/data/config.json';

export const useNarrationStore = defineStore('narration', {
  state: () => ({
    lineQueue: [],
    currentLine: '',
    isActive: false,
    awaitingPlayerInput: false,
    isCurrentLineComplete: false, // --- THE NEW STATE ---
    isSequenceFinished: true,
    skipAnimationSignal: 0,
    _resolvePromise: null,
  }),
  getters: {
    narrationText: (state) => (state.isActive ? state.currentLine : null),
  },
  actions: {
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
        // --- THE FIX IS HERE: Reset states for the new line ---
        this.awaitingPlayerInput = false;
        this.isCurrentLineComplete = false;
        logger.logNarration('QUEUE_ADVANCED', { currentLine: this.currentLine });

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
      }
    },

    // Renamed for clarity
    markLineAsComplete() {
      this.awaitingPlayerInput = true;
      this.isCurrentLineComplete = true;
    },

    playerProceed() {
      // --- THE FIX IS HERE: New two-step logic ---
      if (!this.isCurrentLineComplete) {
        // Step 1: Line is still typing, so the goal is to complete it.
        this.skipAnimationSignal++;
      } else if (this.awaitingPlayerInput) {
        // Step 2: Line is already complete, so the goal is to advance.
        this.nextLine();
      }
    },
  },
});
