import { defineStore } from 'pinia';
import { uiLogger as logger } from '@/utils/loggers/uiLogger';
import gsap from 'gsap';

export const useDisplayStore = defineStore('display', {
  state: () => ({
    isInputLocked: false,
    isDialogueVisible: false,
    areInteractionsVisible: false,
  }),
  actions: {
    lockInput() {
      if (this.isInputLocked) return;
      logger.log('INPUT BLOQUEADO 🛑');
      this.isInputLocked = true;
    },
    unlockInput() {
      if (!this.isInputLocked) return;
      logger.log('INPUT DESBLOQUEADO ✅');
      this.isInputLocked = false;
    },
    async withInputLock(asyncAction) {
      if (this.isInputLocked) {
        logger.warn('Input já está bloqueado, ignorando nova ação.');
        return;
      }
      try {
        this.lockInput();
        await asyncAction();
      } finally {
        this.unlockInput();
      }
    },
    waitFor(durationMs) {
      logger.log(`Aguardando por ${durationMs}ms...`);
      return new Promise(resolve => setTimeout(resolve, durationMs));
    },
    setDialogueVisibility(visible) {
      logger.log(`Visibilidade da DialogueBox definida para: ${visible}`);
      this.isDialogueVisible = visible;
    },
    setInteractionsVisibility(visible) {
      logger.log(`Visibilidade das interações definida para: ${visible}`);
      this.areInteractionsVisible = visible;
    },
    animateSceneFadeOut(duration = 0.7) {
      logger.log('Iniciando fade-out da cena com GSAP...');
      return new Promise(resolve => {
        gsap.to('.fade-overlay', {
          opacity: 1,
          duration: duration,
          ease: 'power2.inOut',
          onComplete: () => {
            logger.log('Fade-out da cena concluído.');
            resolve();
          }
        });
      });
    },
    animateSceneFadeIn(duration = 0.7) {
      logger.log('Iniciando fade-in da cena com GSAP...');
      return new Promise(resolve => {
        gsap.to('.fade-overlay', {
          opacity: 0,
          duration: duration,
          ease: 'power2.inOut',
          onComplete: () => {
            logger.log('Fade-in da cena concluído.');
            resolve();
          }
        });
      });
    }
  },
});
