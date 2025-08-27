<template>
  <p class="dialogue-text" @click.stop="handleClick">
    <span>{{ displayedText }}</span>
    <span class="cursor" v-if="!isAnimationComplete">|</span>
  </p>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useNarrationStore } from '@/stores/narration';

const props = defineProps({
  text: { type: String, default: null },
});

const emit = defineEmits(['animationComplete', 'requestNextLine']);

const configStore = useConfigStore();
const narrationStore = useNarrationStore();
const displayedText = ref('');
const isAnimationComplete = ref(false);
let intervalId = null;

function completeAnimation() {
  if (isAnimationComplete.value) return;
  clearInterval(intervalId);
  displayedText.value = props.text || '';
  isAnimationComplete.value = true;
  emit('animationComplete');
}

// --- A LÓGICA CENTRAL ESTÁ AQUI ---
// Este método é chamado quando o parágrafo de texto é clicado.
function handleClick() {
  if (isAnimationComplete.value) {
    // Se a animação já terminou, emitimos um evento para o pai avançar para a próxima linha.
    emit('requestNextLine');
  } else {
    // Se a animação está em andamento, nós a completamos.
    completeAnimation();
  }
}

watch(() => narrationStore.skipAnimationSignal, () => {
  if (!isAnimationComplete.value) {
    completeAnimation();
  }
});

watch(() => props.text, (newText) => {
  if (intervalId) clearInterval(intervalId);
  
  displayedText.value = '';
  isAnimationComplete.value = false;
  let index = 0;

  if (!newText) {
    isAnimationComplete.value = true;
    return;
  }

  const textSpeed = 110 - (configStore.getSettingValue('textSpeed') || 50);

  intervalId = setInterval(() => {
    if (index < newText.length) {
      displayedText.value += newText[index];
      index++;
    } else {
      clearInterval(intervalId);
      isAnimationComplete.value = true;
      emit('animationComplete');
    }
  }, textSpeed);
}, { immediate: true });

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

defineExpose({
  skipAnimation: completeAnimation,
});
</script>

<style scoped>
.dialogue-text {
  font-family: var(--font-narrative);
  font-size: 1.4em;
  line-height: 1.6;
  margin: 0 0 20px 0;
  min-height: 100px;
  cursor: pointer; /* Adicionado para indicar que o texto é clicável */
}
.cursor {
  animation: blink 1s step-end infinite;
  font-weight: bold;
}
@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>
