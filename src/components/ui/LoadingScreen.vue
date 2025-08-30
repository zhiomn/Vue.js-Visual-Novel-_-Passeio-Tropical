<template>
  <div class="loading-screen">
    <Stars :opacity="0.5" />
    <div class="loading-content">
      <h1 class="title">Passeio Tropical</h1>
      <p class="loading-text">...carregando...</p>
    </div>
  </div>
</template>

<script setup>
import Stars from '@/components/Stars.vue';
</script>

<style scoped>
/* Scoped styles are sufficient here as _loading.css handles the global container */
.loading-content {
  position: relative; /* To be on top of the stars */
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  color: var(--color-text-primary);
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.title {
  font-family: var(--font-narrative);
  font-size: 3em;
  font-weight: normal;
  letter-spacing: 2px;
  margin: 0;
}

.loading-wave {
  width: 150px;
  height: 20px;
}

.loading-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2em;
  color: var(--color-text-muted);
  margin: 0;
}
</style>
