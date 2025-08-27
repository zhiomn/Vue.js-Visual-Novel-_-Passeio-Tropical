<template>
  <span class="terminal-text">
    <span v-for="(char, index) in textChars" :key="index">{{ char }}</span>
    <span class="cursor" v-if="isTyping">|</span>
  </span>
</template>

<script setup>
import { ref, watch, nextTick, defineExpose } from 'vue';
import gsap from 'gsap';

const props = defineProps({ text: { type: String, required: true } });
const emit = defineEmits(['lineComplete', 'requestNextLine']);

const isComplete = ref(false);
const isTyping = ref(false);
const textChars = ref([]);
let timeline = null;

async function animate() {
  isComplete.value = false;
  isTyping.value = true;
  textChars.value = [];
  if (timeline) timeline.kill();

  await nextTick();

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
    }, [], `+=0.02`);
  }
}

function completeAnimation() {
  if (isComplete.value || !timeline) return;
  timeline.progress(1);
}

function handleClick() {
  if (isComplete.value) {
    emit('requestNextLine');
  } else {
    completeAnimation();
  }
}

watch(() => props.text, animate, { immediate: true });

// --- THE FIX IS HERE: Expose the handleClick method to the parent ---
defineExpose({
  handleClick,
});
</script>

<style scoped>
/* THE FIX IS HERE: Removed the local click handler and cursor style. The parent now controls this. */
.terminal-text { white-space: pre-wrap; } 
.cursor { animation: blink 1s step-end infinite; font-weight: bold; }
@keyframes blink { from, to { opacity: 1; } 50% { opacity: 0; } }
</style>
