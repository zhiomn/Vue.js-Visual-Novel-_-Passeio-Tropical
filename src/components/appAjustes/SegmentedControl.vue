<template>
  <div class="segmented-control">
    <button
      v-for="option in options"
      :key="option"
      class="segment-btn"
      :class="{ active: modelValue === option }"
      @click="$emit('update:modelValue', option)"
    >
      {{ option.replace('_', ' ') }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.segmented-control{display:flex;width:100%;background-color:#333;border-radius:8px;padding:4px;border:1px solid var(--color-border)}.segment-btn{flex:1;padding:10px;background:0 0;border:none;color:var(--color-text-muted);cursor:pointer;font-size:.9em;font-weight:500;text-transform:capitalize;transition:all .2s ease}.segment-btn.active{background-color:var(--color-surface);color:var(--color-text-primary);border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.2)}
</style>
