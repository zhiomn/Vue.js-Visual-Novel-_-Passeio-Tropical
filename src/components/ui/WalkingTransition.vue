<template>
  <transition name="overlay-fade">
    <!-- The component is now bound to the central uiStore -->
    <div v-if="uiStore.isTransitioning" class="transition-overlay">
      <div class="footsteps-container">
        <i class="fa-solid fa-shoe-prints footstep f1"></i>
        <i class="fa-solid fa-shoe-prints footstep f2"></i>
        <i class="fa-solid fa-shoe-prints footstep f3"></i>
        <i class="fa-solid fa-shoe-prints footstep f4"></i>
        <i class="fa-solid fa-shoe-prints footstep f5"></i>
      </div>
    </div>
  </transition>
</template>

<script setup>
// Import and use the new UI store
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

// The 'isActive' prop is no longer needed and has been removed.
</script>


<style scoped>
.transition-overlay {
  position: fixed; /* Use fixed to cover the entire viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95); /* Near-opaque black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's on top of everything else */
  pointer-events: none; /* Allow clicks to pass through if needed, though it's usually a blocking overlay */
}

.footsteps-container {
  display: flex;
  gap: 20px;
}

.footstep {
  color: #4a4a4a; /* A light, muted gray */
  font-size: 48px;
  opacity: 0; /* Start completely transparent */
  transform: rotate(-45deg); /* Angle the footsteps */

  /* Link the icon to our custom animation */
  animation-name: walk-step;
  animation-duration: 2s; /* The total duration of one loop */
  animation-iteration-count: infinite; /* Loop forever */
  animation-timing-function: ease-in-out;
}

/*
  Stagger the animation start time for each footstep.
  This is the key to making them appear one after another.
*/
.f2 { animation-delay: 0.2s; }
.f3 { animation-delay: 0.4s; }
.f4 { animation-delay: 0.6s; }
.f5 { animation-delay: 0.8s; }

/* The Keyframes for our "walk" animation */
@keyframes walk-step {
  0% {
    opacity: 0; /* Start invisible */
  }
  20% {
    opacity: 1; /* Quickly fade in */
  }
  80% {
    opacity: 1; /* Hold the visible state */
  }
  100% {
    opacity: 0; /* Fade out at the end of the loop */
  }
}

/* The fade for the entire overlay */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.4s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
