<template>
  <div v-if="playerStore.isReady" class="game-container" 
       :style="{ fontSize: `${configStore.getSettingValue('uiScale')}%` }"
       :class="{ 'phone-is-active': phoneStore.isPhoneVisible }">
    
    <Stars v-if="isContemplative" />

    <SceneTransition
      v-show="runStore.backgroundUrl && !configStore.phoneOnly"
      :background-url="runStore.backgroundUrl"
    />
    
    <DialogueBox
      v-if="displayStore.isDialogueVisible && !configStore.phoneOnly"
      :narration="narrationStore.narrationText"
      :interactions="runStore.availableInteractions"
      :travel-options="runStore.travelOptions"
      :game-phase="runStore.gamePhase"
      :is-final-ending="runStore.isFinalEnding"
      :are-interactions-visible="displayStore.areInteractionsVisible"
      @choiceSelected="runStore.selectChoice"
      @actionExecuted="runStore.executeAction"
      @travelSelected="runStore.travelToScene"
      @startNewRun="runStore.startNextRun"
    />

    <PhoneUI />
  </div>
  <div v-else class="loading-screen">
    <p>Loading Engine...</p>
  </div>
</template>

<script setup>
import { onMounted, computed, nextTick } from 'vue';
import { useRunStore } from '@/stores/useRunStore';
import { useConfigStore } from '@/stores/config';
import { usePlayerStore } from '@/stores/player';
import { useReadStatusStore } from '@/stores/readStatus';
import { useNarrationStore } from '@/stores/narration';
import { usePhoneStore } from '@/stores/phone';
import { useDisplayStore } from '@/stores/useDisplayStore';
import DialogueBox from './components/ui/DialogueBox.vue';
import PhoneUI from './components/phone/PhoneUI.vue';
import SceneTransition from './components/ui/SceneTransition.vue';
import Stars from './components/Stars.vue';
import { createLogger } from './utils/loggers/loggerFactory';

const logger = createLogger('App', '#a78bfa');
const runStore = useRunStore();
const configStore = useConfigStore();
const playerStore = usePlayerStore();
const readStatusStore = useReadStatusStore();
const narrationStore = useNarrationStore();
const phoneStore = usePhoneStore();
const displayStore = useDisplayStore();

const isContemplative = computed(() => {
  return runStore.gamePhase === 'STARTING' || runStore.gamePhase === 'ENDING';
});

onMounted(async () => {
  logger.log('App.vue mounted. Beginning game initialization...');
  configStore.loadSettingsFromLocalStorage();
  readStatusStore.loadReadStatus();
  playerStore.loadProgress();

  await nextTick();

  if (configStore.phoneOnly) {
    phoneStore.isPhoneVisible = true;
    logger.log('PhoneOnly mode detected. Forcing phone visibility.');
  }

  logger.log('Stores loaded. Resuming game session...');
  runStore.resumeGameSession();
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
