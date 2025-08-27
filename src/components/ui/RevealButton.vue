<template>
  <button 
    class="choice-btn"
    :class="buttonClass"
    :disabled="disabled"
    @click.stop="$emit('click')"
    ref="buttonRef"
  >
    <span v-for="(char, index) in textChars" :key="index" class="reveal-char">{{ char }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  text: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  buttonClass: { type: String, default: '' },
});
defineEmits(['click']);

const fullText = `[ ${props.text} ]`;
const textChars = computed(() => fullText.split(''));
const buttonRef = ref(null);

onMounted(async () => {
  await nextTick(); // Espera o Vue renderizar os spans
  if (!buttonRef.value) return;
  const chars = buttonRef.value.querySelectorAll('.reveal-char');
  
  gsap.from(chars, {
    opacity: 0,
    duration: 0.02,
    ease: 'power1.inOut',
    stagger: { from: "random", amount: 0.8 }
  });
});
</script>

<style scoped>
.reveal-char { white-space: pre; }
</style>
