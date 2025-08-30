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
import { computed, onMounted } from 'vue';
import { usePhoneStore } from '@/stores/phone';
import { usePlayerStore } from '@/stores/player';

onMounted(() => {
  console.log('[DEBUG_LOG] TerminalView.vue: Componente Montado.');
});

defineProps({
  ais: { type: Array, required: true },
});

defineEmits(['contact-ai']);

const phoneStore = usePhoneStore();
const playerStore = usePlayerStore();

function isAiCallable(ai) {
  const appState = phoneStore.getAppState(ai.unlocksApp);
  if (playerStore.hasArchitectAwakened) {
    return ai.id === 'manual';
  }
  if (!appState.meetsRequirements) {
    return false;
  }
  if (ai.is_meta_interface) {
    return true;
  }
  return phoneStore.getAppState('terminal').isActivated;
}

function isAiActivated(ai) {
  if (playerStore.hasArchitectAwakened) {
    return ai.id !== 'manual';
  }
  return phoneStore.getAppState(ai.unlocksApp).isActivated;
}
</script>
