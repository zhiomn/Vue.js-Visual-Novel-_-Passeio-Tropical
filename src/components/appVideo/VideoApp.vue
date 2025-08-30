<template>
  <div class="app-container">
    <PhoneAppHeader :title="headerTitle" @back="handleBack" />
    
    <VideoListView 
      v-if="!currentVideoId"
      :videos="contentStore.unlockedVideos"
      @video-selected="openVideo"
    />

    <VideoDetailView
      v-else
      :video-id="currentVideoId"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import VideoListView from './VideoListView.vue';
import VideoDetailView from './VideoDetailView.vue';

const emit = defineEmits(['back']);
const contentStore = useContentStore();
const currentVideoId = ref(null);

const headerTitle = computed(() => currentVideoId.value ? '' : 'Vídeos');

function openVideo(videoId) {
  currentVideoId.value = videoId;
}

function handleBack() {
  if (currentVideoId.value) {
    currentVideoId.value = null;
  } else {
    emit('back');
  }
}
</script>
