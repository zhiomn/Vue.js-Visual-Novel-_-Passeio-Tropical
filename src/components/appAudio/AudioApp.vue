<template>
  <div class="app-container">
    <PhoneAppHeader :title="headerTitle" @back="handleBack" />
    
    <AudioListView 
      v-if="!currentTrackId" 
      :tracks="contentStore.unlockedAudioTracks"
      @track-selected="openTrack" 
    />
    
    <AudioDetailView 
      v-else 
      :track-id="currentTrackId" 
      @track-selected="openTrack"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import { useAudioStore } from '@/stores/audio';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import AudioListView from './AudioListView.vue';
import AudioDetailView from './AudioDetailView.vue';

const emit = defineEmits(['back']);
const currentTrackId = ref(null);
const contentStore = useContentStore();
const audioStore = useAudioStore();

function openTrack(trackId) {
  currentTrackId.value = trackId;
}

function closeTrack() {
  currentTrackId.value = null;
  audioStore._cleanup(); // Clean up audio player on view change
}

const headerTitle = computed(() => currentTrackId.value ? '' : 'Áudios');

function handleBack() {
  if (currentTrackId.value) {
    closeTrack();
  } else {
    emit('back');
  }
}
</script>
