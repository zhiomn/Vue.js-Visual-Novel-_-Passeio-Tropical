<template>
  <div class="list-container">
    <div v-if="contentStore.unlockedNotes.length === 0" class="empty-state">
      No notes have been unlocked yet.
    </div>
    
    <div 
      v-else
      v-for="note in contentStore.unlockedNotes" 
      :key="note.id" 
      class="note-item"
      :class="{ 'is-unread': !readStatusStore.isRead('notes', note.id) }"
      @click="$emit('noteSelected', note.id)"
    >
      <h4>{{ readStatusStore.isRead('notes', note.id) ? note.title : '???' }}</h4>
      <p v-if="readStatusStore.isRead('notes', note.id)" class="note-author">{{ note.author }}</p>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from '@/stores/contentStore';
import { useReadStatusStore } from '@/stores/readStatus';

const contentStore = useContentStore();
const readStatusStore = useReadStatusStore();

defineEmits(['noteSelected']);
</script>

<style scoped>
.list-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}
.note-item { 
  background: #2c2f33; 
  padding: 15px 20px; 
  border-radius: 8px; 
  cursor: pointer; 
  border-left: 4px solid transparent; 
  transition: all .2s ease-in-out;
  margin-bottom: 10px;
}
.note-item:hover { 
  transform: translateX(5px);
  background: #36393f;
}
.note-item.is-unread {
  border-left-color: var(--color-primary);
}
.note-item h4 { margin: 0 0 5px 0; font-size: 1.2em; }
.note-author {
  font-style: italic;
  opacity: 0.7;
  margin: 0;
  font-size: 0.9em;
}
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
  font-style: italic;
}
</style>
