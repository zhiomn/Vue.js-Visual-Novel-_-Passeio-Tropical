<template>
  <div class="content-area detail-view-container">
    <div v-if="isPdfLoading" class="loader-container">
      <div class="spinner"></div>
      <p>Carregando revista...</p>
    </div>
    <iframe
      v-if="obra"
      :src="obra.pdf_url"
      @load="onPdfLoad"
      width="100%"
      height="100%"
      frameborder="0"
      :style="{ visibility: isPdfLoading ? 'hidden' : 'visible' }"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useContentStore } from '@/stores/contentStore';

const props = defineProps({
  obraId: {
    type: String,
    required: true,
  },
});

const contentStore = useContentStore();
const isPdfLoading = ref(true);

const obra = computed(() => {
  return contentStore.unlockedObras.find(o => o.id === props.obraId);
});

function onPdfLoad() {
  isPdfLoading.value = false;
}

watch(() => props.obraId, (newId) => {
  if (newId) {
    isPdfLoading.value = true;
  }
});

onMounted(() => {
  isPdfLoading.value = true;
})
</script>

<style scoped>
.detail-view-container {
  padding: 0;
  position: relative;
  background-color: #2a2a2e;
}
.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: var(--color-text-muted);
}
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(3deg); }
}
</style>
