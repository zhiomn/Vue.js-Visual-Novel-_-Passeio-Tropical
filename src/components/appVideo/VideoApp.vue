<template>
  <div class="app-container">
    <PhoneAppHeader title="Vídeos" @back="$emit('back')" />
    <div class="content-area empty-state-container">
      <i class="fa-solid fa-video-slash empty-icon"></i>
      <h2 class="empty-title">Nenhum Sinal</h2>
      <p class="empty-text">
        Não há transmissões de vídeo disponíveis neste momento.
      </p>
    </div>
  </div>
</template>

<script setup>
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';

defineEmits(['back']);
</script>

<style scoped>
.empty-state-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.empty-icon {
  font-size: 4em;
  color: #4a4a4a;
  margin-bottom: 20px;
}
.empty-title {
  font-size: 1.4em;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}
.empty-text {
  font-size: 1em;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 80%;
}
</style>
