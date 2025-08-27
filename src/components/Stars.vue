<template>
  <div class="stars-container">
    <!-- Each div represents a layer of stars with a different size and speed -->
    <div class="stars small" :style="{ '--shadows': smallShadows }"></div>
    <div class="stars medium" :style="{ '--shadows': mediumShadows }"></div>
    <div class="stars large" :style="{ '--shadows': bigShadows }"></div>

    <!-- The <slot> allows you to place any content (like titles, buttons, etc.) on top of the starfield -->
    <div class="content-overlay">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// --- PROPS for Customization ---
// This makes the component highly reusable. You can change the number of stars from the parent.
const props = defineProps({
  smallStars: { type: Number, default: 700 },
  mediumStars: { type: Number, default: 200 },
  largeStars: { type: Number, default: 100 },
  // This should match the translateY value in the keyframes
  viewportSize: { type: Number, default: 2000 },
});

/**
 * Generates a CSS box-shadow string with 'n' randomized shadows.
 * This function replaces the SASS `@function multiple-box-shadow`.
 * @param {number} n - The number of stars (shadows) to generate.
 * @returns {string} A CSS-ready box-shadow value.
 */
const generateShadows = (n) => {
  let shadowString = '';
  for (let i = 0; i < n; i++) {
    shadowString += `${Math.random() * props.viewportSize}px ${Math.random() * props.viewportSize}px #FFF`;
    // Add a comma after each shadow except the last one
    if (i < n - 1) {
      shadowString += ', ';
    }
  }
  return shadowString;
};

// --- COMPUTED PROPERTIES ---
// We use `computed` so the shadow strings are generated once and cached.
// They will only re-generate if the props (e.g., smallStars) change.
const smallShadows = computed(() => generateShadows(props.smallStars));
const mediumShadows = computed(() => generateShadows(props.mediumStars));
const bigShadows = computed(() => generateShadows(props.largeStars));
</script>

<style scoped>
/* The main container that holds the background and the star layers */
.stars-container {
  position: fixed; /* Use 'fixed' for a background that stays put, or 'absolute' to contain it */
  inset: 0;
  height: 100%;
  width: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
}

/* Base styles for all star layers */
.stars {
  background: transparent;
  /* We use a CSS Custom Property (--shadows) to hold the generated box-shadow string. */
  /* This is key to applying the same shadows to the ::after pseudo-element. */
  box-shadow: var(--shadows);
  animation: animStar linear infinite;
}

/* The magic for seamless looping */
.stars::after {
  content: " ";
  position: absolute;
  /* Place the second set of stars directly below the first one */
  top: 2000px; /* This must match the viewportSize prop and animation value */
  background: transparent;
  box-shadow: var(--shadows); /* Re-use the same star pattern */
}

/* Specific styles for each star layer */
.small {
  width: 1px;
  height: 1px;
  animation-duration: 50s; /* Slowest speed */
}
.small::after {
  width: 1px;
  height: 1px;
}

.medium {
  width: 2px;
  height: 2px;
  animation-duration: 100s; /* Medium speed */
}
.medium::after {
  width: 2px;
  height: 2px;
}

.large {
  width: 3px;
  height: 3px;
  animation-duration: 150s; /* Fastest speed, creating parallax */
}
.large::after {
  width: 3px;
  height: 3px;
}

/* The animation that moves the stars upwards */
@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px); /* This must match the viewportSize and ::after's top value */
  }
}

/* Container for slotted content */
.content-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  color: white; /* Default color for slotted content */
}
</style>
