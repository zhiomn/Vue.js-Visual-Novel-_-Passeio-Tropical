<template>
  <div class="list-container">
    <div 
      v-for="contact in contacts" 
      :key="contact.id" 
      class="contact-item"
      :class="{ 'is-unread': contentStore.isContactUnread(contact.id) }"
      @click="$emit('contactSelected', contact.id)"
    >
      <div class="contact-pfp-container">
        <img v-if="!contact.isAvatarIcon" :src="`assets/avatars/${contact.avatar}`" :alt="contact.name" />
        <i v-else :class="contact.avatar"></i></div>
      <div class="contact-info">
        <div class="contact-name">{{ contact.name }}</div>
        <div class="last-message">{{ contact.messages[0]?.text || '...' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from '@/stores/contentStore';
const contentStore = useContentStore();

defineProps({
  contacts: Array
});
defineEmits(['contactSelected']);
</script>

<style scoped>
/* No changes to style are needed */
</style>
