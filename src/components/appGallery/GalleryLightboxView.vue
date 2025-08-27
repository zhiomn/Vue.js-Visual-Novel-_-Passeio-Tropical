<template>
  <div v-if="item" class="lightbox-container">
    <button class="back-btn" @click="$emit('close')">
      <i class="fa-solid fa-arrow-left"></i>
    </button>
    
    <div class="image-wrapper" @click.self="$emit('close')">
      <img 
        :src="item.url" 
        :alt="item.name" 
        :class="{ 'is-zoomed': isZoomed }"
        @click="toggleZoom"
      />
    </div>

    <div class="caption">
      <p class="caption-title">{{ captionTitle }}</p>
      <p class="caption-subtitle">{{ captionSubtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import { useReadStatusStore } from '@/stores/readStatus';

const props = defineProps({
  itemId: { type: String, required: true },
  itemType: { type: String, required: true },
});
defineEmits(['close']);

const contentStore = useContentStore();
const readStatusStore = useReadStatusStore();
const isZoomed = ref(false);

const item = computed(() => {
    const galleryData = contentStore.galleryContent;
    const sourceArray = props.itemType === 'revista' ? galleryData.revistas : galleryData.pinturas;
    return sourceArray.find(i => i.id === props.itemId);
});

const captionTitle = computed(() => {
    if (!item.value) return '';
    // For both types, the main title ('name') is what we want.
    // For magazines, it's "Tropicalzin 1". For paintings, it's "Claude Monet".
    return item.value.name;
});

const captionSubtitle = computed(() => {
    if (!item.value) return '';
    if (props.itemType === 'revista') {
        return `Capa da revista, publicada em ${item.value.obra.date}`;
    }
    if (props.itemType === 'pintura') {
        return `"${item.value.obra.pintura_name}"`;
    }
    return '';
});

function toggleZoom() {
  isZoomed.value = !isZoomed.value;
}

function triggerReadEvent(id) {
    if (id) {
        readStatusStore.markAsRead('gallery', id);
    }
}

onMounted(() => {
  triggerReadEvent(props.itemId);
});

watch(() => props.itemId, (newId) => {
    triggerReadEvent(newId);
});
</script>

<style scoped>
.lightbox-container {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.back-btn {
  position: absolute;
  top: 50px;
  left: 20px;
  background: rgba(44, 47, 51, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  font-size: 1.5em;
  cursor: pointer;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  z-index: 110;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background: rgba(54, 57, 63, 0.9);
}

.image-wrapper {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  padding: 20px;
  margin-top: 40px; /* Space for the back button */
}

img {
  max-width: 100%;
  max-height: 100%;
  cursor: zoom-in;
  transition: transform 0.3s ease;
  border-radius: 4px;
}

img.is-zoomed {
  transform: scale(1.5);
  cursor: zoom-out;
}

.caption {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px 20px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  text-align: center;
  border-top: 1px solid #333;
}

.caption-title {
  color: var(--color-text-primary);
  font-weight: bold;
  font-size: 1.1em;
  margin: 0 0 5px 0;
}

.caption-subtitle {
  margin: 0;
  font-size: 0.9em;
  font-style: italic;
}
</style>
