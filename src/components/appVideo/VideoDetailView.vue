<template>
  <div v-if="video" class="content-area video-detail-container">
    <div class="video-embed-wrapper">
      <div v-if="isIframeLoading" class="loader-container">
        <div class="spinner"></div>
      </div>
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        title="YouTube video player"
        @load="onIframeLoad"
        :style="{ visibility: isIframeLoading ? 'hidden' : 'visible' }"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div class="video-details">
      <h2 class="title">{{ video.titulo }}</h2>
      <p v-if="video.categoria" class="category">{{ video.categoria }}</p>
      <p class="description">{{ video.descricao }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useContentStore } from '@/stores/contentStore';

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
});

const contentStore = useContentStore();
const isIframeLoading = ref(true);

const video = computed(() => {
  return contentStore.unlockedVideos.find(v => v.id === props.videoId);
});

const embedUrl = computed(() => {
  if (!video.value?.link) return null;
  try {
    const url = new URL(video.value.link);
    const videoId = url.searchParams.get('v');
    // Adiciona parâmetros para otimizar o embed
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0` : null;
  } catch (error) {
    console.error("Invalid video URL:", video.value.link);
    return null;
  }
});

function onIframeLoad() {
  isIframeLoading.value = false;
}

// Reseta o estado de loading quando o vídeo selecionado muda
watch(() => props.videoId, () => {
  isIframeLoading.value = true;
});
</script>
