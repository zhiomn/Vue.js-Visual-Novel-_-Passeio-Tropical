<template>
  <LoadingScreen v-if="isLoading" />
  
  <div v-else class="game-container" 
       :style="{ fontSize: `${configStore.getSettingValue('uiScale')}%` }"
       :class="{ 'phone-is-active': phoneStore.isPhoneVisible }">
    
    <SceneTransition
      v-show="runStore.backgroundUrl && !configStore.phoneOnly"
      :background-url="runStore.backgroundUrl"
    />

    <Stars 
      v-if="runStore.gamePhase !== 'IDLE'" 
      class="stars-layer"
      :class="{ 'exploration-mode': runStore.gamePhase === 'EXPLORING' }"
    />
    
    <!-- Controlador de Visão Principal -->
    <ContemplativeOverlay
        v-if="runStore.gamePhase === 'STARTING' || runStore.gamePhase === 'ENDING'"
        :narration="narrationStore.narrationText"
        :interactions="runStore.availableInteractions"
        :game-phase="runStore.gamePhase"
        :is-final-ending="runStore.isFinalEnding"
        :are-interactions-visible="displayStore.areInteractionsVisible"
    />
    <ExplorationUI
        v-else-if="runStore.gamePhase === 'EXPLORING'"
        :narration="narrationStore.narrationText"
        :interactions="runStore.availableInteractions"
        :are-interactions-visible="displayStore.areInteractionsVisible"
    />
    <TravelOverlay
        v-else-if="runStore.gamePhase === 'TRAVELING'"
        :travel-options="runStore.travelOptions"
    />

    <PhoneUI />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRunStore } from '@/stores/useRunStore';
import { useConfigStore } from '@/stores/config';
import { usePlayerStore } from '@/stores/player';
import { useNarrationStore } from '@/stores/narration';
import { usePhoneStore } from '@/stores/phone';
import { useDisplayStore } from '@/stores/useDisplayStore';
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

onMounted(async () => {
  // 1. Load essential data first
  configStore.loadSettingsFromLocalStorage();
  playerStore.loadProgress();

  // 2. Preload visual assets while showing the loading screen
  await preloadAssets();

  // 3. Once assets are loaded, hide the loading screen
  isLoading.value = false;

  // 4. Proceed with game initialization
  if (configStore.phoneOnly) {
    phoneStore.isPhoneVisible = true;
  }
  
  resumeGameSession();
});
</script>

<style scoped>
/* No changes needed here, loading screen has its own CSS */
.stars-layer.exploration-mode {
  opacity: 0.5;
}
</style>
