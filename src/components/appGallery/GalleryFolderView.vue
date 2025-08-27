<template>
  <div class="content-area folder-view-container">
    
    <!-- Revistas Folder -->
    <div class="folder-wrapper" @click="$emit('folderSelected', 'revistas')">
      <div class="folder-preview">
        <div v-if="revistaPreviews.length > 0" class="preview-grid">
          <img v-for="(url, index) in revistaPreviews" :key="`revista-${index}`" :src="url" />
        </div>
        <div v-else class="preview-placeholder">
          <i class="fa-solid fa-book-journal-whills"></i>
        </div>
      </div>
      <span class="folder-name">Capas de Revistas</span>
    </div>

    <!-- Pinturas Folder -->
    <div class="folder-wrapper" @click="$emit('folderSelected', 'pinturas')">
      <div class="folder-preview">
        <div v-if="pinturaPreviews.length > 0" class="preview-grid">
          <img v-for="(url, index) in pinturaPreviews" :key="`pintura-${index}`" :src="url" />
        </div>
        <div v-else class="preview-placeholder">
          <i class="fa-solid fa-palette"></i>
        </div>
      </div>
      <span class="folder-name">Pinturas</span>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  revistas: { type: Array, required: true },
  pinturas: { type: Array, required: true },
});

defineEmits(['folderSelected']);

/**
 * Helper function to get up to 4 random, unlocked thumbnail URLs from a list of items.
 * @param {Array} items - The source array of gallery items.
 * @returns {Array<string>} An array of up to 4 thumbnail URLs.
 */
const getRandomPreviews = (items) => {
  if (!items) return [];
  // 1. Filter for only unlocked items
  const unlocked = items.filter(item => item.isUnlocked);
  // 2. Shuffle the unlocked items
  for (let i = unlocked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unlocked[i], unlocked[j]] = [unlocked[j], unlocked[i]];
  }
  // 3. Take the first 4 and map to their thumbnail URLs
  return unlocked.slice(0, 4).map(item => item.thumbnailUrl);
};

const revistaPreviews = computed(() => getRandomPreviews(props.revistas));
const pinturaPreviews = computed(() => getRandomPreviews(props.pinturas));
</script>

<style scoped>
.folder-view-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 25px 20px 20px 20px;
  align-content: baseline;
  height: 100%;
  box-sizing: border-box;
}

.folder-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.folder-wrapper:hover {
  transform: scale(1.05);
}

.folder-preview {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #2c2f33;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
}

.preview-grid img {
  width: 100%;
  height: 100%;
  /* --- THE FIX IS HERE --- */
  aspect-ratio: 1 / 1;  /* Enforce a square shape */
  object-fit: cover;    /* Fill the square, cropping excess */
}

.preview-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 3.5em;
  color: #4a4a4a;
}

.folder-name {
  font-size: 1em;
  font-weight: 500;
  color: var(--color-text-primary);
  text-align: center;
}
</style>
