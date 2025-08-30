import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { usePlayerStore } from '@/stores/player';
import { useReadStatusStore } from '@/stores/readStatus';
import appsData from '@/data/apps.json';
import escolhasData from '@/data/escolhas.json'; // <-- IMPORT ADICIONADO

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
    console.warn('[DEV TOOL] Jumping to end-game state...');
    const playerStore = usePlayerStore(pinia);
    const readStatusStore = useReadStatusStore(pinia);

    readStatusStore.markAllAsRead();
    playerStore.runCount = 3;
    playerStore.hasArchitectAwakened = true;
    playerStore.isGameFinished = true;
    playerStore.isFinalUnlockActive = true;
    playerStore.activatedApps = appsData.map(app => app.id);
    
    playerStore.saveProgress();
    readStatusStore.saveReadStatus();

    console.warn('[DEV TOOL] State saved. Reloading...');
    location.reload();
  };

  // --- A NOVA FERRAMENTA DE DEPURAÇÃO ESTÁ AQUI ---
  const jumpToRun2 = () => {
    console.warn('[DEV TOOL] Jumping to the start of Run 2...');
    const playerStore = usePlayerStore(pinia);
    const readStatusStore = useReadStatusStore(pinia);

    // 1. Simular a conclusão da Run 1 (7 escolhas feitas)
    const choicesToUnlock = escolhasData.slice(0, 7).map(e => e.id);
    playerStore.unlockedEscolhaIds = choicesToUnlock;

    // 2. Marcar as notas correspondentes como lidas para acionar desbloqueios
    choicesToUnlock.forEach(id => {
      // Simula o desbloqueio causal que ocorreria no jogo
      readStatusStore.markAsRead('notes', `note_${id}`);
    });

    // 3. Definir o estado do jogador para o início da Run 2
    playerStore.runCount = 2;
    playerStore.activatedApps = ['messages', 'notes', 'gallery', 'ajustes'];
    playerStore.gamePhase = 'STARTING'; // Garante que comece na sequência de início
    playerStore.lastSceneName = null;
    playerStore.visitedScenesInThisRun = [];

    // 4. Salvar e recarregar
    playerStore.saveProgress();
    readStatusStore.saveReadStatus();
    console.warn('[DEV TOOL] State for Run 2 saved. Reloading...');
    location.reload();
  };

  window.resetGame = resetGame;
  window.jumpToEnd = jumpToEnd;
  window.jumpToRun2 = jumpToRun2; // <-- Expõe a nova função
  
  console.log('[DEV TOOL] Funções disponíveis: resetGame(), jumpToRun2(), jumpToEnd()');
}
