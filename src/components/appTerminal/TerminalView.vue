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
        <span v-if="phoneStore.getAppState(ai.unlocksApp).meetsRequirements || playerStore.hasArchitectAwakened">
          [ {{ ai.command }} {{ ai.nome_br }} ]
        </span>
        <span v-else>[ ????? ]</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePhoneStore } from '@/stores/phone';
import { usePlayerStore } from '@/stores/player';
import { createLogger } from '@/utils/loggers/loggerFactory';

const componentLogger = createLogger('TerminalView', '#4ade80');

onMounted(() => {
  componentLogger.log('Componente Montado.');
});

defineProps({
  ais: { type: Array, required: true },
});

defineEmits(['contact-ai']);

const phoneStore = usePhoneStore();
const playerStore = usePlayerStore();

function isAiCallable(ai) {
  const appState = phoneStore.getAppState(ai.unlocksApp);
  const isVideoActivated = phoneStore.getAppState('video').isActivated;

  componentLogger.log(`isAiCallable check for '${ai.id}'`, { 
    isFinalUnlockActive: playerStore.isFinalUnlockActive,
    isVideoActivated: isVideoActivated,
    hasArchitectAwakened: playerStore.hasArchitectAwakened
  });

  // --- LOGIC RE-ORDERED AND HARDENED ---

  // 1. Epilogue State: Final unlock is active, but epilogue hasn't run yet.
  if (playerStore.isFinalUnlockActive && !isVideoActivated) {
    const result = ai.id === 'codex';
    componentLogger.log(` > Epilogue mode active. Callable: ${result}`);
    return result;
  }

  // 2. Awakened State: Architect is awake, but Manual dialogue hasn't happened.
  if (playerStore.hasArchitectAwakened && !playerStore.isFinalUnlockActive) {
    const result = ai.id === 'manual';
    componentLogger.log(` > Architect Awakened mode active. Callable: ${result}`);
    return result;
  }
  
  // 3. Post-Epilogue Sandbox or Standard Game State.
  if (!appState.meetsRequirements) {
    componentLogger.log(` > Requirements not met. Callable: false`);
    return false;
  }
  if (ai.is_meta_interface) {
    componentLogger.log(` > Is meta interface. Callable: true`);
    return true;
  }
  const result = phoneStore.getAppState('terminal').isActivated;
  componentLogger.log(` > Standard check (terminal activated?). Callable: ${result}`);
  return result;
}

function isAiActivated(ai) {
  const isVideoActivated = phoneStore.getAppState('video').isActivated;

  if (playerStore.isFinalUnlockActive && !isVideoActivated) {
    return ai.id !== 'codex';
  }

  if (playerStore.hasArchitectAwakened && !playerStore.isFinalUnlockActive) {
    return ai.id !== 'manual';
  }
  
  return phoneStore.getAppState(ai.unlocksApp).isActivated;
}
</script>
