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
import { ref, computed } from 'vue';
import { usePhoneStore } from '@/stores/phone';
import { usePlayerStore } from '@/stores/player';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import TerminalView from './TerminalView.vue';
import DialogueView from './DialogueView.vue';
import aisData from '@/data/ais.json';

const emit = defineEmits(['back']);

const phoneStore = usePhoneStore();
const playerStore = usePlayerStore();
const currentView = ref('list');
const currentAIId = ref(null);

const currentAI = computed(() => {
  if (!currentAIId.value) return null;
  return aisData.find(ai => ai.id === currentAIId.value);
});

// --- NEW: Determine if we are re-viewing a dialogue ---
const isReviewMode = computed(() => {
  if (!currentAI.value) return false;
  return phoneStore.getAppState(currentAI.value.unlocksApp).isActivated;
});

function startDialogue(aiId) {
  currentAIId.value = aiId;
  currentView.value = 'dialogue';
}

function handleDialogueComplete(appToUnlock) {
  if (appToUnlock) {
    playerStore.addActivatedApp(appToUnlock);
  }
}

function handleOpenApp(appToUnlock) {
  if (appToUnlock) {
    phoneStore.openApp(appToUnlock);
  }
  // --- REMOVED: No longer automatically closes the view ---
  // currentAIId.value = null;
  // currentView.value = 'list';
}

// --- NEW: Centralized back button logic ---
function handleBack() {
  if (currentView.value === 'dialogue') {
    currentView.value = 'list';
    currentAIId.value = null;
  } else {
    emit('back'); // Close the Terminal app itself
  }
}
</script>

<style scoped>
.terminal-container { padding: 0; display: flex; flex-direction: column; flex-grow: 1; }
</style>
