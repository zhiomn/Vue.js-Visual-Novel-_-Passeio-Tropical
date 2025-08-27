<template>
  <div class="custom-slider-wrapper">
    <div class="slider-track" ref="trackRef" @mousedown="handleInteractionStart">
      <div class="slider-progress" :style="{ width: `${progress}%` }"></div>
      <div class="slider-thumb" :style="{ left: `${progress}%` }"></div>
    </div>
    <span class="slider-value">{{ displayValue }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
});

const emit = defineEmits(['update:modelValue', 'input']);

const trackRef = ref(null);
const isDragging = ref(false);

const progress = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100;
});

const displayValue = computed(() => {
  if (props.step < 1) return props.modelValue.toFixed(1);
  return Math.round(props.modelValue);
});

const updateValue = (clientX) => {
  if (!trackRef.value) return;
  const rect = trackRef.value.getBoundingClientRect();
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  let newValue = props.min + percent * (props.max - props.min);

  // Snap to step
  const steps = (newValue - props.min) / props.step;
  newValue = props.min + Math.round(steps) * props.step;
  
  emit('update:modelValue', newValue);
  emit('input', newValue);
};

const handleInteractionStart = (event) => {
  isDragging.value = true;
  updateValue(event.clientX);
  window.addEventListener('mousemove', handleInteractionMove);
  window.addEventListener('mouseup', handleInteractionEnd);
};

const handleInteractionMove = (event) => {
  if (isDragging.value) {
    updateValue(event.clientX);
  }
};

const handleInteractionEnd = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', handleInteractionMove);
  window.removeEventListener('mouseup', handleInteractionEnd);
};

onUnmounted(() => {
  window.removeEventListener('mousemove', handleInteractionMove);
  window.removeEventListener('mouseup', handleInteractionEnd);
});
</script>

<style scoped>
.custom-slider-wrapper{display:flex;align-items:center;gap:15px}.slider-track{position:relative;width:100%;height:8px;background-color:#333;border-radius:4px;cursor:pointer}.slider-progress{position:absolute;height:100%;background-color:var(--color-primary);border-radius:4px}.slider-thumb{position:absolute;top:50%;width:20px;height:20px;background-color:white;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 1px 4px rgba(0,0,0,.3)}.slider-value{font-weight:500;min-width:30px;text-align:center;color:var(--color-text-muted)}
</style>
