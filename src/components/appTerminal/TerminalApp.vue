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

onMounted(() => {
  console.log('[DEBUG_LOG] TerminalApp.vue: Componente Montado.');
});

const emit = defineEmits(['back']);

const phoneStore = usePhoneStore();
const playerStore = usePlayerStore();
const currentView = ref('list');
const currentAIId = ref(null);

const currentAI = computed(() => {
  if (!currentAIId.value) return null;
  return aisData.find(ai => ai.id === currentAIId.value);
});

const isReviewMode = computed(() => {
  if (!currentAI.value) return false;
  if (playerStore.isFinalUnlockActive) return true;
  return phoneStore.getAppState(currentAI.value.unlocksApp).isActivated;
});

function startDialogue(aiId) {
  currentAIId.value = aiId;
  currentView.value = 'dialogue';
}

function handleDialogueComplete(appToUnlock) {
  if (currentAI.value?.id === 'manual') {
    playerStore.setFinalUnlockState();
  }
  if (appToUnlock) {
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
    currentAIId.value = null;
  } else {
    emit('back');
  }
}
</script>

<style scoped>
.terminal-container { padding: 0; display: flex; flex-direction: column; flex-grow: 1; }
</style>
