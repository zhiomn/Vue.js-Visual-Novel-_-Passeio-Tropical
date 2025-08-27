<template>
  <div class="app-container">
    <PhoneAppHeader :title="headerTitle" @back="handleBack" />
    
    <!-- Show the list view if no contact is selected -->
    <ContactListView 
      v-if="!currentContactId" 
      :contacts="contentStore.unlockedContacts"
      @contact-selected="openContact" 
    />
    
    <!-- Show the detail view if a contact IS selected -->
    <ContactDetailView 
      v-else 
      :contact-id="currentContactId" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import ContactListView from './ContactListView.vue';
import ContactDetailView from './ContactDetailView.vue';

const emit = defineEmits(['back']);

const contentStore = useContentStore();
const currentContactId = ref(null);

function openContact(contactId) {
  currentContactId.value = contactId;
}

function closeContact() {
  currentContactId.value = null;
}

// The header title and back button behavior are now dynamic
const headerTitle = computed(() => {
  return currentContactId.value ? '' : 'Contacts'; // Hide title in detail view
});

function handleBack() {
  if (currentContactId.value) {
    closeContact(); // If in detail view, go back to the list
  } else {
    emit('back'); // If in list view, close the app
  }
}
</script>
