import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { usePlayerStore } from '@/stores/player';

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
  window.resetGame = resetGame;
  console.log('[DEV TOOL] A função `resetGame()` está disponível no console para reiniciar o jogo.');
}
