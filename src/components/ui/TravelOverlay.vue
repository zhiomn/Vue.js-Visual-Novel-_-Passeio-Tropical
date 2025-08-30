<template>
  <div class="travel-overlay">
    <div class="content-wrapper contemplative-mode">
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
/* A sobreposição em si ainda precisa de estilos, mas os botões agora herdam do global */
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
  gap: 1.5rem;
}
</style>
