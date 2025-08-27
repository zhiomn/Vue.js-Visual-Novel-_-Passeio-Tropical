<template>
  <div class="chat-container" v-if="contact">
    <PhoneAppHeader @back="$emit('back')">
      <div class="custom-chat-header">
        <div class="header-pfp-container">
          <img v-if="!contact.isAvatarIcon" :src="`./assets/avatars/${contact.avatar}`" :alt="contact.name" />
          <i v-else :class="contact.avatar"></i>
        </div>
        <div class="header-name">{{ contact.name }}</div>
      </div>
    </PhoneAppHeader>

    <div class="messages-list">
      <div v-for="message in contact.messages" :key="message.id" class="message-wrapper">
        <div 
          class="message-bubble received" 
          @click="readStatusStore.markAsRead('messages', message.id)"
          :class="{ 'unread': !readStatusStore.isRead('messages', message.id) }"
        >
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import { useReadStatusStore } from '@/stores/readStatus';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';

const props = defineProps({ contactId: String });
defineEmits(['back']);

const contentStore = useContentStore();
const readStatusStore = useReadStatusStore();

const contact = computed(() => {
  return contentStore.unlockedMessages.find(c => c.id === props.contactId);
});
</script>

<style scoped>
/* Styles for the custom header content we are injecting */
.custom-chat-header {
  display: flex;
  align-items: center;
  overflow: hidden; /* Prevents long names from breaking the layout */
}
.header-pfp-container {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0; /* Prevents the avatar from shrinking */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
}
.header-pfp-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.header-pfp-container i {
  font-size: 1.5em;
  color: #666;
}
.header-name {
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Original component styles */
.chat-container { width: 100%; height: 100%; display: flex; flex-direction: column; background-color: #0f0f0f; }
.messages-list { flex-grow: 1; overflow-y: auto; padding: 20px 10px; display: flex; flex-direction: column; }
.message-wrapper { display: flex; margin-bottom: 10px; }
.message-bubble { padding: 12px 18px; border-radius: 22px; line-height: 1.5; max-width: 80%; cursor: pointer; }
.received { background: #262626; color: #fff; align-self: flex-start; border-bottom-left-radius: 8px; }
.message-bubble.unread { font-weight: normal; background: #3a3a3a; }
</style>
