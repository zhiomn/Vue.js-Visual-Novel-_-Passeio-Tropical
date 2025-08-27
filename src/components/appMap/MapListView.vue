<template>
  <div class="content-area list-container">
    <div v-if="!locations || locations.length === 0" class="empty-state">
      Nenhum local foi descoberto ainda. Conheça os autores para revelar seus lugares de origem.
    </div>
    
    <div 
      v-else
      v-for="location in locations" 
      :key="location.id" 
      class="location-item"
      :class="{ 'is-locked': !location.isUnlocked }"
      @click="location.isUnlocked ? $emit('locationSelected', location.id) : null"
    >
      <div class="location-thumbnail">
        <img v-if="location.isUnlocked && location.foto" :src="`./assets/images/cities/${location.foto}`" :alt="location.nome" />
        <i v-else class="fa-solid fa-lock"></i>
      </div>
      <div class="location-info">
        <div class="location-name">{{ location.isUnlocked ? location.nome : 'Local Desconhecido' }}</div>
        <div class="location-country" v-if="location.isUnlocked">{{ location.estado ? `${location.estado}, ` : '' }}{{ location.pais }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  locations: {
    type: Array,
    required: true,
  },
});
defineEmits(['locationSelected']);
</script>

<style scoped>
.list-container { padding: 10px; }
.location-item { display: flex; align-items: center; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; background-color: #2c2f33; margin-bottom: 10px; }
.location-item:hover:not(.is-locked) { background-color: #36393f; transform: translateX(4px); }
.location-item.is-locked { opacity: 0.5; cursor: not-allowed; }
.location-thumbnail { width: 80px; flex-shrink: 0; margin-right: 15px; aspect-ratio: 4 / 3; border-radius: 6px; overflow: hidden; background-color: #1c1c1e; display: flex; justify-content: center; align-items: center; }
.location-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.location-thumbnail i { font-size: 2em; color: #555; }
.location-name { font-size: 1.1em; font-weight: 500; margin-bottom: 3px; }
.location-country { font-size: 0.9em; color: var(--color-text-muted); }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-muted); font-style: italic; }
</style>
