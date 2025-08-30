<template>
  <div class="travel-overlay">
    <div class="content-wrapper">
      <div class="choice-container">
        <RevealButton
          v-for="destination in travelOptions"
          :key="`travel-${destination}`"
          :text="`Viajar para ${destination}`"
          :disabled="displayStore.isInputLocked"
          button-class="special-btn"
          @click="travelToScene(destination)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDisplayStore } from '@/stores/useDisplayStore';
import { travelToScene } from '@/services/runOrchestrator';
import RevealButton from './RevealButton.vue';

const displayStore = useDisplayStore();

defineProps({
  travelOptions: Array,
});
</script>

<style scoped>
.travel-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-wrapper {
  text-align: center;
  color: var(--color-text-primary);
}
.choice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem; /* Increased gap for a more deliberate feel */
}
/* Import styles from _components.css for contemplative buttons */
:deep(.choice-btn) {
  background: none; border: none; backdrop-filter: none;
  width: auto; padding: 8px 15px; font-family: 'Courier New', Courier, monospace;
  font-size: 1.4em; /* Larger font for travel mode */
  color: var(--color-text-muted); font-weight: normal;
  transition: color 0.2s ease; white-space: nowrap;
}
:deep(.choice-btn:hover:not(:disabled)) {
  background: none; border-color: transparent; transform: none; color: var(--color-text-primary);
}
:deep(.special-btn) { color: var(--color-primary); font-weight: bold; }
:deep(.special-btn:hover:not(:disabled)) { color: white; }
</style>
