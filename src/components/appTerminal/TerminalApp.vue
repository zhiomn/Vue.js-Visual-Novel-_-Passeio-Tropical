<template>
  <div class="app-container">
    <PhoneAppHeader title="Terminal" @back="handleBack" />
    <div class="content-area terminal-container">
      <TerminalView
        v-if="currentView === 'list'"
        :ais="aisData"
        @contact-ai="startDialogue"
      />
      <DialogueView
        v-else-if="currentView === 'dialogue' && currentAI"
        :ai="currentAI"
        :is-review-mode="isReviewMode"
        @dialogue-complete="handleDialogueComplete"
        @open-app-confirmed="handleOpenApp"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePhoneStore } from '@/stores/phone';
import { usePlayerStore } from '@/stores/player';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import TerminalView from './TerminalView.vue';
import DialogueView from './DialogueView.vue';
import aisData from '@/data/ais.json';
import finalWordsData from '@/data/ais-finalwords.json';
import { createLogger } from '@/utils/loggers/loggerFactory';

const componentLogger = createLogger('TerminalApp', '#a855f7');

onMounted(() => {
  componentLogger.log('Componente Montado.');
});

const emit = defineEmits(['back']);

const phoneStore = usePhoneStore();
const playerStore = usePlayerStore();
const currentView = ref('list');
const currentAIId = ref(null);

let currentAI = ref(null);

const isReviewMode = computed(() => {
  if (!currentAI.value) return false;
  
  if (playerStore.isFinalUnlockActive && !phoneStore.getAppState('video').isActivated) {
     return currentAI.value.id !== 'codex';
  }
  
  if (playerStore.hasArchitectAwakened) {
    return currentAI.value.id !== 'manual'
  }
  
  return phoneStore.getAppState(currentAI.value.unlocksApp).isActivated;
});

function startDialogue(aiId) {
  const baseAI = aisData.find(ai => ai.id === aiId);
  if (!baseAI) return;

  const aiObject = { ...baseAI };

  const isVideoActivated = phoneStore.getAppState('video').isActivated;
  if (playerStore.isFinalUnlockActive && aiId === 'codex' && !isVideoActivated) {
    componentLogger.log("Epilogue condition met for 'Index'. Loading final words dialogue.");
    aiObject.dialogue = finalWordsData;
    aiObject.confirmation_prompt = null; 
    aiObject.isEpilogue = true; 
  } else {
    componentLogger.log(`Loading standard dialogue for '${aiId}'.`);
  }

  currentAI.value = aiObject; 
  currentAIId.value = aiId;
  currentView.value = 'dialogue';
}

function handleDialogueComplete(appToUnlock) {
  // --- LOGIC CORRECTED ---
  // When Manual dialogue finishes, ONLY set the final unlock state.
  // DO NOT activate the video app here.
  if (currentAI.value?.id === 'manual' && !playerStore.isFinalUnlockActive) {
    playerStore.setFinalUnlockState();
  }

  // When the Epilogue dialogue finishes, activate the video app,
  // which will then unlock all buttons in the view.
  if (currentAI.value?.isEpilogue) {
    componentLogger.log("Epilogue dialogue complete. Activating 'video' app to unlock all buttons.");
    playerStore.addActivatedApp('video');
  }

  // Standard app activation for other AIs
  if (appToUnlock && appToUnlock !== 'video') { // Prevent double-activation
    playerStore.addActivatedApp(appToUnlock);
  }
}

function handleOpenApp(appToUnlock) {
  if (appToUnlock) {
    phoneStore.openApp(appToUnlock);
  }
}

function handleBack() {
  if (currentView.value === 'dialogue') {
    currentView.value = 'list';
    currentAI.value = null;
    currentAIId.value = null;
  } else {
    emit('back');
  }
}
</script>

<style scoped>
.terminal-container { padding: 0; display: flex; flex-direction: column; flex-grow: 1; }
</style>
