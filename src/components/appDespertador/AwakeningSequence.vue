<template>
  <div class="awakening-container">
    <Static :fps="15" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Static from '@/components/Static.vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 4000,
  },
});

const emit = defineEmits(['sequence-complete']);

let timeoutId = null;

onMounted(() => {
  timeoutId = setTimeout(() => {
    emit('sequence-complete');
  }, props.duration);
});

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>

<style scoped>
.awakening-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 500;
}
</style>
