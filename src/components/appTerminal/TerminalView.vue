<template>
  <div class="terminal-list-container">
    <div class="terminal-output">
      <p>> EXECUTANDO SCAN DE MÓDULOS DISPONÍVEIS...</p>
      <p>> SINAIS ESTÁVEIS DETECTADOS:</p>
    </div>
    <div class="contact-buttons-container">
      <button
        v-for="ai in ais"
        :key="ai.id"
        class="contact-btn"
        :class="{ 'is-activated': isAiActivated(ai) }"
        :disabled="!isAiCallable(ai)"
        @click="$emit('contact-ai', ai.id)"
      >
        <span v-if="phoneStore.getAppState(ai.unlocksApp).meetsRequirements">
          [ {{ ai.command }} {{ ai.nome_br }} ]
        </span>
        <span v-else>[ ????? ]</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { usePhoneStore } from '@/stores/phone';

defineProps({
  ais: { type: Array, required: true },
});

defineEmits(['contact-ai']);

const phoneStore = usePhoneStore();

const isCodexInitiated = phoneStore.getAppState('terminal').isActivated;

function isAiCallable(ai) {
  const appState = phoneStore.getAppState(ai.unlocksApp);
  
  if (!appState.meetsRequirements) {
    return false;
  }
  
  // --- THE NEW LOGIC FOR ENABLING/DISABLING BUTTONS ---

  // If the AI is Codex itself, it's callable as long as its requirements are met.
  if (ai.is_meta_interface) {
    return true; // The visual state will be handled by the 'is-activated' class.
  }

  // For all other AIs, Codex MUST have been initiated first.
  return isCodexInitiated;
}

function isAiActivated(ai) {
  return phoneStore.getAppState(ai.unlocksApp).isActivated;
}
</script>

<style scoped>
.terminal-list-container {
  font-family: 'Courier New', Courier, monospace;
  color: #33ff33;
  background-color: #0d0d0d;
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.terminal-output {
  line-height: 1.6;
}
.terminal-output p {
  margin: 0 0 5px 0;
}
.contact-buttons-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.contact-btn {
  background-color: transparent;
  border: 1px solid #33ff33;
  color: #33ff33;
  padding: 10px;
  font-family: inherit;
  font-size: 1em;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
.contact-btn:hover:not(:disabled) {
  background-color: #33ff33;
  color: #0d0d0d;
}
.contact-btn:disabled {
  border-color: #2a522a;
  color: #2a522a;
  cursor: not-allowed;
}
.contact-btn.is-activated {
  border-color: #4a4a4a;
  color: #4a4a4a;
}
.contact-btn.is-activated:hover:not(:disabled) {
  background-color: #222;
  color: #666;
}
</style>
