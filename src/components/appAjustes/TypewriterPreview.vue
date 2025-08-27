<template>
  <div class="preview-container">
    <p class="preview-text">
      {{ displayedText }}<span class="cursor" v-if="isTyping">|</span>
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  speed: { type: Number, required: true }, // Speed from 10 to 100
});

const displayedText = ref('');
const isTyping = ref(false);
let intervalId = null;

const animateText = () => {
  if (intervalId) clearInterval(intervalId);
  
  displayedText.value = '';
  isTyping.value = true;
  let index = 0;
  
  // Mapeia o valor do slider (10-100) para um intervalo de tempo (ex: 150ms a 10ms)
  const intervalTime = 160 - (props.speed * 1.5);

  intervalId = setInterval(() => {
    if (index < props.text.length) {
      displayedText.value += props.text[index];
      index++;
    } else {
      clearInterval(intervalId);
      isTyping.value = false;
    }
  }, intervalTime);
};

watch(() => props.speed, animateText, { immediate: true });

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.preview-container {
  background-color: #2c2f33;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  border: 1px solid var(--color-border);
}
.preview-text {
  margin: 0;
  font-family: var(--font-narrative);
  color: var(--color-text-muted);
  font-size: 0.9em;
  min-height: 1.2em;
}
.cursor {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>
