<template>
  <div class="status-bar">
    <div class="time">{{ currentTime }}</div>
    <div class="icons-right">
      <!-- Notification Icons -->
      <div class="notification-icons">
        <i v-if="notificationStore.hasUnreadMessages" class="fa-solid fa-comments"></i>
        <i v-if="notificationStore.hasUnreadNotes" class="fa-solid fa-note-sticky"></i>
        <i v-if="notificationStore.hasUnreadGalleryItems" class="fa-solid fa-images"></i>
        <!-- Add other app notification icons here -->
      </div>
      <!-- System Icons -->
      <i class="fa-solid fa-wifi"></i>
      <i class="fa-solid fa-battery-full"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '@/stores/notifications';

const notificationStore = useNotificationStore();
const currentTime = ref('');
let timeInterval = null;

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;
}

onMounted(() => {
  updateTime(); // Update immediately on mount
  timeInterval = setInterval(updateTime, 1000 * 30); // Then update every 30 seconds
});

onUnmounted(() => {
  clearInterval(timeInterval); // Clean up the interval to prevent memory leaks
});
</script>

<style scoped>
.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 0 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-primary);
  font-size: 0.9em;
  font-weight: 500;
  z-index: 100; /* Ensure it's on top of app content */
  background: black;
    opacity: 70%;
}
.time {
  font-family: var(--font-main);
}
.icons-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.notification-icons {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
}
</style>
