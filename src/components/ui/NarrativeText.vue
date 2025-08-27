<template>
  <p class="dialogue-text" ref="containerRef">
    <span v-for="(char, index) in textChars" :key="index" class="narrative-char">{{ char }}</span>
    <span class="cursor" v-if="isTyping">|</span>
  </p>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import gsap from 'gsap';
import { useNarrationStore } from '@/stores/narration';

const props = defineProps({
  text: { type: String, required: true },
});
const emit = defineEmits(['lineComplete']);

const narrationStore = useNarrationStore();
const isComplete = ref(false);
const isTyping = ref(false);
const textChars = ref([]);
const containerRef = ref(null);
let timeline = null;

async function animate() {
  isComplete.value = false;
  isTyping.value = true;
  textChars.value = [];
  if (timeline) timeline.kill();
  
  await nextTick(); // Espera o Vue criar o <p> vazio
  
  timeline = gsap.timeline({
    onComplete: () => {
      isTyping.value = false;
      isComplete.value = true;
      emit('lineComplete');
    }
  });

  for (let i = 0; i < props.text.length; i++) {
    timeline.call(() => {
        textChars.value[i] = props.text[i];
    }, [], `+=${0.03}`);
  }
}

function completeAnimation() {
  if (isComplete.value || !timeline) return;
  timeline.progress(1);
}

// Reage ao sinal da store para se autocompletar
watch(() => narrationStore.skipAnimationSignal, completeAnimation);

watch(() => props.text, animate, { immediate: true });
</script>

<style scoped>
.narrative-char { white-space: pre-wrap; }
.cursor { animation: blink 1s step-end infinite; font-weight: bold; }
@keyframes blink { from, to { opacity: 1; } 50% { opacity: 0; } }
</style>
