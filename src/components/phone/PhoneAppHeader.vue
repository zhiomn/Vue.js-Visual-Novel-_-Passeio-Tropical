<template>
  <div class="app-header">
    <button v-if="showBack" class="back-btn" @click="$emit('back')">&lt;</button>
    
    <!-- 
      THE FIX IS HERE:
      We add a <slot> element. If the parent component provides custom content
      (like an avatar and name), it will be rendered here.
      If not, the content INSIDE the <slot> tags acts as a fallback,
      preserving the original functionality for all other apps.
    -->
    <slot>
      <div class="header-title">{{ title }}</div>
    </slot>

  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    // Title is no longer strictly required, as the slot can be used instead.
    required: false 
  },
  showBack: {
    type: Boolean,
    default: true
  }
});
defineEmits(['back']);
</script>
