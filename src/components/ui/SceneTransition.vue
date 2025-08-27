<template>
  <div class="scene-transition-container">
    <transition name="scene-fade" mode="out-in">
      <div
        class="background-image"
        :key="backgroundUrl"
        :style="{ backgroundImage: `url(${backgroundUrl})` }"
      ></div>
    </transition>
    <div class="fade-overlay"></div>
  </div>
</template>

<script setup>
defineProps({
  backgroundUrl: String,
});
</script>

<style scoped>
.scene-transition-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.background-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.fade-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0;
  pointer-events: none;
  /* A propriedade 'transition' foi removida, pois o GSAP agora controla a animação. */
}

/* Transição entre imagens de fundo (controlada pelo <transition> do Vue) */
.scene-fade-leave-active,
.scene-fade-enter-active {
  transition: opacity 0.7s ease-in-out;
}

.scene-fade-enter-from,
.scene-fade-leave-to {
  opacity: 0;
}
</style>
