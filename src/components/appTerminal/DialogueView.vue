<template>
  <div class="dialogue-container" ref="containerRef" @click="handleContainerClick">
    <div v-for="(line, index) in dialogueHistory" :key="`history-${index}`" class="dialogue-line">
      <span class="speaker-label">{{ line.speaker }}:</span>
      <span>{{ line.line }}</span>
    </div>
    <div v-if="currentLine" class="dialogue-line">
      <span class="speaker-label">{{ currentLine.speaker }}:</span>
      <TerminalText
        :text="currentLine.line"
        ref="terminalTextRef"
        @lineComplete="onAnimationComplete"
        @requestNextLine="advanceDialogue"
      />
    </div>
    <div v-if="viewState === 'awaiting_confirmation'" class="confirmation-container">
      <p>{{ ai.confirmation_prompt }}</p>
      <div class="confirmation-buttons">
        <button class="contact-btn" @click.stop="handleConfirmation(true)">[ Sim ]</button>
        <button class="contact-btn" @click.stop="handleConfirmation(false)">[ Não ]</button>
      </div>
    </div>
    <div v-if="showContinueIndicator" class="continue-indicator">▼</div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'; // <-- Importar 'watch'
import { usePhoneStore } from '@/stores/phone'; // <-- Importar a phoneStore
import TerminalText from '../ui/TerminalText.vue';

const props = defineProps({
  ai: { type: Object, required: true },
  isReviewMode: { type: Boolean, default: false }
});

const emit = defineEmits(['dialogue-complete', 'open-app-confirmed']);

const phoneStore = usePhoneStore(); // <-- Obter instância da store
const viewState = ref('dialogue');
const dialogueQueue = ref([]);
const dialogueHistory = ref([]);
const currentLine = ref(null);
const canAdvance = ref(false);
const showContinueIndicator = ref(false);
const containerRef = ref(null);
const terminalTextRef = ref(null);

async function scrollToBottom() {
  await nextTick();
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
  }
}

onMounted(() => {
  if (props.isReviewMode) {
    dialogueHistory.value = [...props.ai.dialogue];
    if (props.ai.post_activation_message) {
        dialogueHistory.value.push({
            speaker: 'Terminal',
            line: props.ai.post_activation_message,
        });
    }
    canAdvance.value = false;
    scrollToBottom();
  } else if (props.ai.dialogue) {
    dialogueQueue.value = [...props.ai.dialogue];
    canAdvance.value = true;
    advanceDialogue();
  }
});

function onAnimationComplete() {
  canAdvance.value = true;
  showContinueIndicator.value = true;
}

function advanceDialogue() {
  if (!canAdvance.value) return;
  showContinueIndicator.value = false;
  canAdvance.value = false;
  if (currentLine.value) {
    dialogueHistory.value.push(currentLine.value);
  }
  if (dialogueQueue.value.length > 0) {
    currentLine.value = dialogueQueue.value.shift();
    scrollToBottom();
  } else {
    currentLine.value = null;
    emit('dialogue-complete', props.ai.unlocksApp);
    
    if (props.ai.confirmation_prompt) {
        viewState.value = 'awaiting_confirmation';
        scrollToBottom();
    } else {
        dialogueHistory.value.push({
            speaker: 'Terminal',
            line: props.ai.post_activation_message,
        });
        viewState.value = 'dialogue_ended';
        scrollToBottom();
    }
  }
}

function handleContainerClick() {
    if (!currentLine.value || !terminalTextRef.value) return;
    terminalTextRef.value.handleClick();
}

// --- NOVA LÓGICA ---
// Observa o sinal da store e chama o manipulador de clique quando ele muda.
watch(() => phoneStore.terminalAdvanceSignal, () => {
    handleContainerClick();
});

function handleConfirmation(shouldOpenApp) {
  if (shouldOpenApp) {
    emit('open-app-confirmed', props.ai.unlocksApp);
  } else {
    dialogueHistory.value.push({
      speaker: 'Terminal',
      line: props.ai.post_activation_message,
    });
    viewState.value = 'dialogue_ended';
    scrollToBottom();
  }
}
</script>

<style scoped>
.dialogue-container { font-family: 'Courier New', Courier, monospace; color: #33ff33; background-color: #0d0d0d; padding: 20px; flex-grow: 1; position: relative; overflow-y: auto; cursor: pointer;}
.dialogue-line { margin-bottom: 1em; font-size: 1em !important; line-height: 1.6; display: flex; align-items: baseline; }
.speaker-label { font-weight: bold; margin-right: 1ch; color: #a3e635; }
.continue-indicator { position: static; text-align: right; margin-right:20px; bottom: 20px; right: 20px; font-size: 1.5em; color: #33ff33; animation: blink 1s step-end infinite; }
@keyframes blink { from, to { opacity: 1; } 50% { opacity: 0; } }
.confirmation-container { margin-top: 2em; }
.confirmation-container p { font-style: italic; color: #a3e635; }
.confirmation-buttons { margin-top: 1em; display: flex; gap: 1em; }
.contact-btn { background-color: transparent; border: 1px solid #33ff33; color: #33ff33; padding: 10px; font-family: inherit; font-size: 1em; text-align: left; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
.contact-btn:hover { background-color: #33ff33; color: #0d0d0d; }
</style>
