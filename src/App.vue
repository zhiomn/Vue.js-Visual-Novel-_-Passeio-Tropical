<template>
  <div v-if="playerStore.isReady" class="game-container" 
       :style="{ fontSize: `${configStore.getSettingValue('uiScale')}%` }"
       :class="{ 'phone-is-active': phoneStore.isPhoneVisible }">
    
    <SceneTransition
      v-show="runStore.backgroundUrl && !configStore.phoneOnly"
      :background-url="runStore.backgroundUrl"
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
        :travel-options="runStore.travelOptions"
        :are-interactions-visible="displayStore.areInteractionsVisible"
    />

    <PhoneUI />
  </div>
  <div v-else class="loading-screen">
    <p>Loading Engine...</p>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import { useRunStore } from '@/stores/useRunStore';
import { useConfigStore } from '@/stores/config';
import { usePlayerStore } from '@/stores/player';
import { useNarrationStore } from '@/stores/narration';
import { usePhoneStore } from '@/stores/phone';
import { useDisplayStore } from '@/stores/useDisplayStore';
import { resumeGameSession } from '@/services/runOrchestrator';
import PhoneUI from './components/phone/PhoneUI.vue';
import SceneTransition from './components/ui/SceneTransition.vue';
import ContemplativeOverlay from './components/ui/ContemplativeOverlay.vue';
import ExplorationUI from './components/ui/ExplorationUI.vue';
import { createLogger } from './utils/loggers/loggerFactory';

const logger = createLogger('App', '#a78bfa');
const runStore = useRunStore();
const configStore = useConfigStore();
const playerStore = usePlayerStore();
const narrationStore = useNarrationStore();
const phoneStore = usePhoneStore();
const displayStore = useDisplayStore();

onMounted(async () => {
  logger.group('App Initialization');
  configStore.loadSettingsFromLocalStorage();
  playerStore.loadProgress();
  await nextTick();

  logger.logState('Initial PlayerStore', { ...playerStore.$state });
  logger.logState('Initial RunStore', { ...runStore.$state });

  if (configStore.phoneOnly) {
    phoneStore.isPhoneVisible = true;
  }
  
  resumeGameSession();
  logger.groupEnd();
});
</script>

<style scoped>
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #121212;
  color: #a0a0a0;
  font-family: var(--font-main);
}
</style>
