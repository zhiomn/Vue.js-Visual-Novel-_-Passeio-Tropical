<template>
  <div class="content-area list-container">
    <div v-if="!tracks || tracks.length === 0" class="empty-state">
      Nenhuma faixa de áudio foi encontrada.
    </div>
    
    <div 
      v-else
      v-for="track in tracks" 
      :key="track.id" 
      class="track-item"
      :class="{ 'is-locked': !track.isUnlocked }"
      @click="track.isUnlocked ? $emit('trackSelected', track.id) : null"
    >
      <div class="track-icon">
        <i :class="track.isUnlocked ? 'fa-solid fa-play' : 'fa-solid fa-lock'"></i>
      </div>
      <div class="track-info">
        <div class="track-title">{{ track.title }}</div>
        <div class="track-author">{{ track.authorName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tracks: {
    type: Array,
    required: true,
  },
});
defineEmits(['trackSelected']);
</script>

<style scoped>
.list-container { padding: 10px; }
.track-item { display: flex; align-items: center; padding: 15px; border-radius: 8px; background-color: #2c2f33; margin-bottom: 10px; cursor: pointer; transition: all 0.2s ease; }
.track-item:hover:not(.is-locked) { background-color: #36393f; }
.track-item.is-locked { opacity: 0.5; cursor: not-allowed; }
.track-item.is-locked .track-icon { color: #666; }
.track-icon { font-size: 1.5em; margin-right: 20px; color: var(--color-primary); }
.track-title { font-size: 1.1em; font-weight: 500; margin-bottom: 3px; }
.track-author { font-size: 0.9em; color: var(--color-text-muted); }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-muted); font-style: italic; }
</style>
