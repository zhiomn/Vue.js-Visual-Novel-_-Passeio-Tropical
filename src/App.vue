<template>
  <LoadingScreen v-if="isLoading" />
  
  <template v-else>
    <div class="game-container" 
         :style="{ fontSize: `${configStore.getSettingValue('uiScale')}%` }"
         :class="{ 'phone-is-active': phoneStore.isPhoneVisible }">
      
      <SceneTransition
        v-show="runStore.backgroundUrl && !configStore.phoneOnly"
        :background-url="runStore.backgroundUrl"
      />

      <Stars 
        v-if="runStore.gamePhase !== 'IDLE' && !playerStore.isGameFinished" 
        class="stars-layer"
        :class="{ 'exploration-mode': runStore.gamePhase === 'EXPLORING' }"
      />
      
      <!-- Controlador de Visão Principal -->
      <ContemplativeOverlay
          v-if="(runStore.gamePhase === 'STARTING' || runStore.gamePhase === 'ENDING') && !playerStore.isGameFinished"
          :narration="narrationStore.narrationText"
          :interactions="runStore.availableInteractions"
          :game-phase="runStore.gamePhase"
          :is-final-ending="runStore.isFinalEnding"
          :are-interactions-visible="displayStore.areInteractionsVisible"
      />
      <ExplorationUI
          v-else-if="runStore.gamePhase === 'EXPLORING' && !playerStore.isGameFinished"
          :narration="narrationStore.narrationText"
          :interactions="runStore.availableInteractions"
          :are-interactions-visible="displayStore.areInteractionsVisible"
      />
      <TravelOverlay
          v-else-if="runStore.gamePhase === 'TRAVELING' && !playerStore.isGameFinished"
          :travel-options="runStore.travelOptions"
      />

      <!-- TELA DE FINALIZAÇÃO -->
      <div v-if="playerStore.isGameFinished" class="game-finished-overlay">
        <Stars />
        <div class="finished-content">
          <p>Obrigad@ por jogar :)</p>
          <p>A história fica por aqui, mas você pode continuar vendo os conteúdos no celular...</p>
        </div>
      </div>
    </div>

    <!-- O PhoneUI agora é um irmão do game-container, garantindo que ele sempre fique na camada superior correta. -->
    <PhoneUI />
  </template>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRunStore } from '@/stores/useRunStore';
import { useConfigStore } from '@/stores/config';
import { usePlayerStore } from '@/stores/player';
import { useNarrationStore } from '@/stores/narration';
import { usePhoneStore } from '@/stores/phone';
import { useDisplayStore } from '@/stores/useDisplayStore';
import { useReadStatusStore } from '@/stores/readStatus';
import { resumeGameSession } from '@/services/runOrchestrator';
import { preloadAssets } from '@/services/preloader';

import LoadingScreen from './components/ui/LoadingScreen.vue';
import PhoneUI from './components/phone/PhoneUI.vue';
import SceneTransition from './components/ui/SceneTransition.vue';
import Stars from './components/Stars.vue';
import ContemplativeOverlay from './components/ui/ContemplativeOverlay.vue';
import ExplorationUI from './components/ui/ExplorationUI.vue';
import TravelOverlay from './components/ui/TravelOverlay.vue';

const isLoading = ref(true);
const runStore = useRunStore();
const configStore = useConfigStore();
const playerStore = usePlayerStore();
const narrationStore = useNarrationStore();
const phoneStore = usePhoneStore();
const displayStore = useDisplayStore();
const readStatusStore = useReadStatusStore();

onMounted(async () => {
  // 1. Load essential data first
  configStore.loadSettingsFromLocalStorage();
  playerStore.loadProgress();
  readStatusStore.loadReadStatus();

  // 2. Preload visual assets while showing the loading screen
  await preloadAssets();

  // 3. Once assets are loaded, hide the loading screen
  isLoading.value = false;

  // 4. Proceed with game initialization
  if (configStore.phoneOnly) {
    phoneStore.isPhoneVisible = true;
  }
  
  if (!playerStore.isGameFinished) {
    resumeGameSession();
  }
});
</script>

<style scoped>
.stars-layer.exploration-mode {
  opacity: 0.5;
}

.game-finished-overlay {
  position: absolute;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--color-bg-dark);
  animation: fadeIn 1.5s ease;
}

.finished-content {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.3em;
  color: var(--color-text-primary);
  line-height: 1.8;
  padding: 20px;
  max-width: 600px;
}
</style>
