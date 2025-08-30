<template>
  <div class="content-area video-list-container">
    <div
      v-for="video in videos"
      :key="video.id"
      class="video-item"
      @click="$emit('video-selected', video.id)"
    >
      <div class="video-thumbnail">
        <img :src="`./assets/images/videos/${video.thumbnail}`" :alt="video.titulo" />
      </div>
      <div class="video-meta">
        <p class="title">{{ video.titulo }}</p>
        <span v-if="video.categoria" class="category">{{ video.categoria }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  videos: {
    type: Array,
    required: true,
  },
});
defineEmits(['video-selected']);
</script>
