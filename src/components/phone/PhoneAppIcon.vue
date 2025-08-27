<template>
  <div class="app-wrapper" :class="{ 'is-locked': !isUnlocked }">
    <div 
      class="app-icon" 
      :style="{ background: isUnlocked ? appColor : 'linear-gradient(135deg, #485461 0%, #28313b 100%)' }"
      @click="$emit('open')"
    >
      <!-- Show the real icon if unlocked, otherwise show a placeholder -->
      <i :class="isUnlocked ? appIcon : 'fa-solid fa-lock'"></i>
    </div>
    <!-- Show the real name if unlocked, otherwise show '???' -->
    <span class="app-name">{{ isUnlocked ? appName : '???' }}</span>
  </div>
</template>

<script setup>
defineProps({ 
  appName: String,
  appIcon: String,
  appColor: String,
  isUnlocked: Boolean, // <-- The new, crucial prop
});
defineEmits(['open']);
</script>

<style scoped>


</style>
