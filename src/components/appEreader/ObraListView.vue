<template>
  <div class="content-area list-container">
    <div v-if="!obras || obras.length === 0" class="empty-state">
      Nenhuma obra foi encontrada na estante. Veja imagens na Galeria para descobri-las.
    </div>
    
    <div 
      v-else
      v-for="obra in obras" 
      :key="obra.id" 
      class="obra-item"
      :class="{ 'is-locked': !obra.isUnlocked }"
      @click="obra.isUnlocked ? $emit('obraSelected', obra.id) : null"
    >
      <div class="obra-cover">
        <!-- THE FIX IS HERE: Use thumbnail_url instead of cover_image -->
        <img v-if="obra.isUnlocked" :src="obra.thumbnail_url" :alt="obra.name" />
        <i v-else class="fa-solid fa-lock"></i>
      </div>
      <div class="obra-info">
        <div class="obra-name">{{ obra.isUnlocked ? obra.name : '???' }}</div>
        <div class="obra-meta" v-if="obra.isUnlocked">
          <span class="obra-date">{{ obra.date }}</span>
          <span class="obra-count">{{ obra.poem_count }} poesias</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  obras: {
    type: Array,
    required: true,
  },
});
defineEmits(['obraSelected']);
</script>

<style scoped>
.list-container { padding: 10px; }
.obra-item { display: flex; align-items: center; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; background-color: #2c2f33; margin-bottom: 10px; }
.obra-item:hover:not(.is-locked) { background-color: #36393f; transform: translateX(4px); }
.obra-item.is-locked { opacity: 0.5; cursor: not-allowed; }
.obra-cover { width: 60px; flex-shrink: 0; margin-right: 15px; aspect-ratio: 1 / 1.414; border-radius: 4px; overflow: hidden; background-color: #1c1c1e; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
.obra-cover img { width: 100%; height: 100%; object-fit: cover; }
.obra-cover i { font-size: 1.8em; color: #555; }
.obra-name { font-size: 1.1em; font-weight: 500; margin-bottom: 7px; }
.obra-meta { font-size: 0.9em; color: var(--color-text-muted); display: grid; justify-content: space-between; align-items: center; }
.obra-date {     padding-bottom: 5px; }
.obra-count { font-style: italic; opacity: 0.8; }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-muted); font-style: italic; }
</style>
