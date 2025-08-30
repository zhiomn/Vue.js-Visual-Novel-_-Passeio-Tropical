<template>
  <div class="stars-container" :style="{ opacity: opacity }">
    <!-- Each div represents a layer of stars with a different size and speed -->
    <div class="stars small" :style="{ '--shadows': smallShadows }"></div>
    <div class="stars medium" :style="{ '--shadows': mediumShadows }"></div>
    <div class="stars large" :style="{ '--shadows': bigShadows }"></div>

    <!-- The <slot> is now only used in Contemplative mode, but we keep it for flexibility -->
    <div class="content-overlay">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  smallStars: { type: Number, default: 700 },
  mediumStars: { type: Number, default: 200 },
  largeStars: { type: Number, default: 100 },
  viewportSize: { type: Number, default: 2000 },
  // A nova prop para controlar a opacidade
  opacity: { type: Number, default: 0.3 },
});

const generateShadows = (n) => {
  let shadowString = '';
  for (let i = 0; i < n; i++) {
    shadowString += `${Math.random() * props.viewportSize}px ${Math.random() * props.viewportSize}px #FFF`;
    if (i < n - 1) {
      shadowString += ', ';
    }
  }
  return shadowString;
};

const smallShadows = computed(() => generateShadows(props.smallStars));
const mediumShadows = computed(() => generateShadows(props.mediumStars));
const bigShadows = computed(() => generateShadows(props.largeStars));
</script>

<style scoped>
.stars-container {
  position: absolute; /* Alterado para absolute para se encaixar no layout do App.vue */
  inset: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none; /* Garante que a camada não intercepte cliques */
  transition: opacity 0.7s ease-in-out;
}

.stars {
  background: transparent;
  box-shadow: var(--shadows);
  animation: animStar linear infinite;
}

.stars::after {
  content: " ";
  position: absolute;
  top: 2000px;
  background: transparent;
  box-shadow: var(--shadows);
}

.small { width: 1px; height: 1px; animation-duration: 150s; } /* Velocidade ajustada */
.small::after { width: 1px; height: 1px; }

.medium { width: 2px; height: 2px; animation-duration: 100s; }
.medium::after { width: 2px; height: 2px; }

.large { width: 3px; height: 3px; animation-duration: 50s; } /* Velocidade ajustada */
.large::after { width: 3px; height: 3px; }

@keyframes animStar {
  from { transform: translateY(0px); }
  to { transform: translateY(-2000px); }
}

.content-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  color: white;
}
</style>
