<template>
  <div v-if="track" class="content-area player-container">
    <div class="cover-art">
      <img :src="track.coverImage" :alt="track.obraName" />
    </div>
    
    <div class="track-details">
      <h2 class="track-title">{{ track.title }}</h2>
      <p class="track-author">{{ track.authorName }}</p>
    </div>
    
    <div class="player-controls">
      <div class="time-display">
        <span>{{ formatTime(audioStore.currentTime) }}</span>
        <span>{{ formatTime(audioStore.duration) }}</span>
      </div>
      
      <input
        type="range"
        class="progress-bar"
        :value="audioStore.isSeeking ? localCurrentTime : audioStore.currentTime"
        :max="audioStore.duration || 100"
        @input="updateLocalTime"
        @mousedown="audioStore.startSeeking"
        @mouseup="seek"
        @touchstart="audioStore.startSeeking"
        @touchend="seek"
      />
      
      <div class="buttons">
        <button class="player-btn" @click="playPrevious" :disabled="!canGoPrevious"><i class="fa-solid fa-backward-step"></i></button>
        
        <button class="player-btn play-btn" @click="togglePlay">
          <i :class="audioStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
        </button>
        
        <button class="player-btn" @click="playNext" :disabled="!canGoNext"><i class="fa-solid fa-forward-step"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import { useAudioStore } from '@/stores/audio';
import { useReadStatusStore } from '@/stores/readStatus';

const props = defineProps({ trackId: { type: String, required: true } });
const emit = defineEmits(['trackSelected']);

const contentStore = useContentStore();
const audioStore = useAudioStore();
const readStatusStore = useReadStatusStore();
const localCurrentTime = ref(0);

const track = computed(() => contentStore.unlockedAudioTracks.find(t => t.id === props.trackId));
const allTracks = computed(() => contentStore.unlockedAudioTracks);
const currentIndex = computed(() => allTracks.value.findIndex(t => t.id === props.trackId));
const canGoNext = computed(() => currentIndex.value < allTracks.value.length - 1);
const canGoPrevious = computed(() => currentIndex.value > 0);

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function playNext() {
  if (canGoNext.value) {
    emit('trackSelected', allTracks.value[currentIndex.value + 1].id);
  }
}

function playPrevious() {
  if (canGoPrevious.value) {
    emit('trackSelected', allTracks.value[currentIndex.value - 1].id);
  }
}

function togglePlay() {
  if (track.value) audioStore.playTrack(track.value);
}

function updateLocalTime(event) {
    if (audioStore.isSeeking) localCurrentTime.value = parseFloat(event.target.value);
}

function seek(event) {
    const time = parseFloat(event.target.value);
    audioStore.endSeeking(time);
    localCurrentTime.value = time;
}

function initializeTrack(trackData) {
    if (trackData) {
        audioStore.playTrack(trackData);
        readStatusStore.markAsRead('audio', trackData.id);
    }
}

onMounted(() => initializeTrack(track.value));
watch(() => props.trackId, (newTrackId) => {
    const newTrack = contentStore.unlockedAudioTracks.find(t => t.id === newTrackId);
    initializeTrack(newTrack);
});

</script>

<style scoped>
.progress-bar{-webkit-appearance:none;width:100%;height:6px;background:#444;border-radius:3px;outline:0;margin-bottom:20px}.progress-bar::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;background:var(--color-primary);cursor:pointer;border-radius:50%}.player-container{display:flex;flex-direction:column;padding:30px}.cover-art{width:100%;aspect-ratio:1/1;border-radius:12px;overflow:hidden;margin-bottom:30px;box-shadow:0 10px 30px rgba(0,0,0,.4)}.cover-art img{width:100%;height:100%;object-fit:cover}.track-details{text-align:center;margin-bottom:30px}.track-title{font-size:1.5em;font-weight:700;margin:0 0 5px}.track-author{font-size:1.1em;color:var(--color-text-muted);margin:0}.player-controls{margin-top:auto}.time-display{display:flex;justify-content:space-between;font-size:.8em;color:var(--color-text-muted);margin-bottom:5px}.buttons{display:flex;justify-content:center;align-items:center;gap:40px}.player-btn{background:0 0;border:none;color:var(--color-text-primary);font-size:1.8em;cursor:pointer;transition: color 0.2s ease;}.player-btn:disabled { color: #555; cursor: not-allowed; }.play-btn{font-size:3em;color:var(--color-primary)}
</style>
