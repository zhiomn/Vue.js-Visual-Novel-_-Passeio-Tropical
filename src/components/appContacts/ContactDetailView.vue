<template>
  <div v-if="contact" class="content-area detail-container">
    <div class="profile-header">
      <div class="profile-pfp-container">
        <img v-if="contact.avatar" :src="`./assets/avatars/${contact.avatar}`" :alt="contact.name" />
        <i v-else class="fa-solid fa-user-circle"></i>
      </div>
      <h2 class="profile-name">{{ contact.name }}</h2>
      <p class="profile-location">
        <span>{{ contact.types.join(' / ') }}</span>
        <span v-if="contact.cityName"> • </span>
        <span>{{ contact.cityName }}, {{ contact.estado }}, {{ contact.pais }}</span>
      </p></div>

    <div class="divider"></div>

    <div class="profile-details">
      <div v-if="contact.descricao" class="detail-item">
        <h3>Sobre</h3>
        <p>{{ contact.descricao }}</p>
      </div>
      <div v-if="contact.born_date" class="detail-item">
        <h3>Nascimento</h3>
        <p>{{ contact.born_date }}</p>
      </div>
      <div v-if="contact.link" class="detail-item">
        <h3>Online</h3>
        <a :href="contact.link" target="_blank">{{ contact.link }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import { useReadStatusStore } from '@/stores/readStatus';

const props = defineProps({
  contactId: {
    type: String,
    required: true,
  },
});

const contentStore = useContentStore();
const readStatusStore = useReadStatusStore();

const contact = computed(() => {
  return contentStore.unlockedContacts.find(c => c.id === props.contactId);
});

function triggerReadEvent(id) {
  if (id) {
    readStatusStore.markAsRead('contacts', id);
  }
}

onMounted(() => {
  triggerReadEvent(props.contactId);
});

watch(() => props.contactId, (newId) => {
  triggerReadEvent(newId);
});

</script>

<style scoped>
.detail-container {
  padding: 25px;
}
.profile-header {
  text-align: center;
  margin-bottom: 25px;
}
.profile-pfp-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c2f33;
  border: 3px solid #444;
}
.profile-pfp-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-pfp-container i {
  font-size: 4em;
  color: #555;
}
.profile-name {
  font-size: 1.8em;
  font-weight: 600;
  margin: 0;
}
.profile-location {
  font-size: 1.1em;
  color: var(--color-text-muted);
  margin-top: 5px;
}
.divider {
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 25px;
}
.detail-item {
  margin-bottom: 20px;
}
.detail-item h3 {
  font-size: 0.9em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}
.detail-item p, .detail-item a {
  font-size: 1.1em;
  color: var(--color-text-primary);
  text-decoration: none;
}
.detail-item a {
  color: var(--color-primary);
}
</style>
