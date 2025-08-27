<template>
  <div v-if="note" class="content-area">
    <h2 class="note-title">{{ note.title }}</h2>
    <p class="note-author">{{ note.author }}</p>
    
    <div class="divider"></div>
    
    <p class="note-text">{{ note.text }}</p>
    
    <p class="note-source">Publicado na revista {{ note.obra }}</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import { useReadStatusStore } from '@/stores/readStatus';

const props = defineProps({
  noteId: {
    type: String,
    required: true
  }
});

const contentStore = useContentStore();
const readStatusStore = useReadStatusStore();

const note = computed(() => {
  return contentStore.unlockedNotes.find(n => n.id === props.noteId);
});

onMounted(() => {
  if (props.noteId) {
    readStatusStore.markAsRead('notes', props.noteId);
  }
});
</script>

<style scoped>
.content-area {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}
.note-title {
  font-family: var(--font-narrative);
  font-size: 2em;
  margin: 0 0 10px 0;
  color: var(--color-primary);
}
.note-author {
  font-style: italic;
  font-size: 1.2em;
  opacity: 0.8;
  margin: 0 0 20px 0;
}
.divider {
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}
.note-text {
  font-family: var(--font-narrative);
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1.1em;
  margin-bottom: 40px;
}
.note-source {
  font-style: italic;
  text-align: right;
  opacity: 0.6;
  font-size: 0.9em;
}
</style>
