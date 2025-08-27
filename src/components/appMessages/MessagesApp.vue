<template>
  <div class="app-container messages-app-layout">
    <div v-if="!currentContactId" class="view-wrapper">
      <PhoneAppHeader title="Mensagens" @back="$emit('back')" />
      <ContactList 
        :contacts="sortedContacts" 
        @contact-selected="openChat" 
      />
    </div>

    <ChatView 
      v-else
      :contact-id="currentContactId"
      @back="closeChat"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import { useReadStatusStore } from '@/stores/readStatus';
import { sortContentByReadStatus } from '@/utils/sortUtils';
import ContactList from './ContactList.vue';
import ChatView from './ChatView.vue';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';

defineEmits(['back']);

const contentStore = useContentStore();
const readStatusStore = useReadStatusStore();
const currentContactId = ref(null);

const sortedContacts = computed(() => {
  const rawContacts = contentStore.unlockedMessages;
  
  if (!readStatusStore.readIds || !readStatusStore.readIds.messages) {
    return rawContacts;
  }

  const readMessageIds = [...readStatusStore.readIds.messages];
  return sortContentByReadStatus(rawContacts, readMessageIds, 'name');
});

function openChat(contactId) {
  currentContactId.value = contactId;
}
function closeChat() {
  currentContactId.value = null;
}
</script>

<style scoped>
.messages-app-layout, .view-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
