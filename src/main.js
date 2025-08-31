import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { usePlayerStore } from '@/stores/player';
import { useReadStatusStore } from '@/stores/readStatus';
import appsData from '@/data/apps.json';
import escolhasData from '@/data/escolhas.json';

import App from './App.vue';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

app.mount('#app');

if (import.meta.env.DEV) {
  const resetGame = () => {
    console.warn('[DEV TOOL] Executing full game reset...');
    const playerStore = usePlayerStore(pinia);
    playerStore.resetGame();
  };
  
  const jumpToEnd = () => {
    console.warn('[DEV TOOL] Jumping to pre-finale state (Architect Awakened)...');
    const playerStore = usePlayerStore(pinia);
    const readStatusStore = useReadStatusStore(pinia);

    // This now jumps to the point where the player has finished the 3 runs
    // and has just awakened the architect, making the 'Manual' AI available.
    readStatusStore.markAllAsRead();
    playerStore.runCount = 3;
    playerStore.hasArchitectAwakened = true;
    
    // --- CRITICAL FIX: DO NOT set these flags ---
    // playerStore.isGameFinished = true; 
    // playerStore.isFinalUnlockActive = true; 
    
    // Activate all apps EXCEPT the final one unlocked by Manual.
    playerStore.activatedApps = appsData
      .map(app => app.id)
      .filter(id => id !== 'video');
    
    playerStore.saveProgress();
    readStatusStore.saveReadStatus();

    console.warn('[DEV TOOL] State saved. Reloading...');
    location.reload();
  };

  const jumpToRun2 = () => {
    console.warn('[DEV TOOL] Jumping to the start of Run 2...');
    const playerStore = usePlayerStore(pinia);
    const readStatusStore = useReadStatusStore(pinia);

    const choicesToUnlock = escolhasData.slice(0, 7).map(e => e.id);
    playerStore.unlockedEscolhaIds = choicesToUnlock;

    choicesToUnlock.forEach(id => {
      readStatusStore.markAsRead('notes', `note_${id}`);
    });

    playerStore.runCount = 2;
    playerStore.activatedApps = ['messages', 'notes', 'gallery', 'ajustes'];
    playerStore.gamePhase = 'STARTING';
    playerStore.lastSceneName = null;
    playerStore.visitedScenesInThisRun = [];

    playerStore.saveProgress();
    readStatusStore.saveReadStatus();
    console.warn('[DEV TOOL] State for Run 2 saved. Reloading...');
    location.reload();
  };

  window.resetGame = resetGame;
  window.jumpToEnd = jumpToEnd;
  window.jumpToRun2 = jumpToRun2;
  
  console.log('[DEV TOOL] Funções disponíveis: resetGame(), jumpToRun2(), jumpToEnd()');
}
