<template>
  <div class="app-container">
    <PhoneAppHeader :title="headerTitle" @back="handleBack" />
    
    <!-- Show the list view if no note is selected -->
    <NoteListView 
      v-if="!currentNoteId" 
      @note-selected="openNote" 
    />
    
    <!-- Show the detail view if a note IS selected -->
    <NoteDetailView 
      v-else 
      :note-id="currentNoteId" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import NoteListView from './NoteListView.vue';
import NoteDetailView from './NoteDetailView.vue';

// 1. We define our emits ONCE and assign the result to the 'emit' constant.
const emit = defineEmits(['back']);

// This local state variable controls which view is visible
const currentNoteId = ref(null);

function openNote(noteId) {
  currentNoteId.value = noteId;
}

function closeNote() {
  currentNoteId.value = null;
}

// The header title and back button behavior are now dynamic
const headerTitle = computed(() => {
  return currentNoteId.value ? '' : 'Notes'; // Hide title in detail view for a cleaner look
});

function handleBack() {
  if (currentNoteId.value) {
    closeNote(); // If in detail view, go back to the list view
  } else {
    // 2. We can now safely use the 'emit' constant we defined earlier.
    emit('back'); // If in list view, close the app
  }
}
</script>

<!-- No scoped style is needed as this is a controller component -->
