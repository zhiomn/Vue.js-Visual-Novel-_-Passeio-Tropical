<template>
  <div class="content-area grid-container">
    <div v-if="!items || items.length === 0" class="empty-state">
      Nenhum item encontrado nesta galeria. Continue explorando para descobrir mais.
    </div>
    
    <div 
      v-else
      v-for="item in items"
      :key="item.id"
      class="gallery-item"
      :class="{ 'is-locked': !item.isUnlocked }"
      @click="item.isUnlocked ? $emit('itemSelected', item) : null"
    >
      <div class="item-content">
        <img v-if="item.isUnlocked" :src="item.thumbnailUrl" :alt="item.name" />
        <i v-else class="fa-solid fa-lock"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
defineEmits(['itemSelected']);
</script>

<style scoped>
/* --- THE FIX IS HERE --- */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px;
  /* This tells the grid to only be as tall as its content and align to the top. */
  align-content: start; 
}

.gallery-item {
  position: relative;
  width: 100%;
  height: 0;
  border-radius: 4px;
  cursor: pointer;
  background-color: #2c2f33;
  /* UNIFIED TALL ASPECT RATIO FOR ALL ITEMS */
  padding-bottom: 141.4%;
}

.item-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  transition: transform 0.2s ease;
}
.gallery-item:not(.is-locked):hover .item-content {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
  z-index: 10;
}
.gallery-item.is-locked .item-content {
  cursor: not-allowed;
  background-color: #23272a;
  border: 2px dashed #444;
  box-sizing: border-box;
}
.item-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.item-content i {
  font-size: 2.5em;
  color: #444;
}
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
  font-style: italic;
}
</style>
