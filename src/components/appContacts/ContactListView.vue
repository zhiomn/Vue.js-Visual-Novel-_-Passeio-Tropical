<template>
  <div class="content-area list-container">
    <div v-if="!contacts || contacts.length === 0" class="empty-state">
      Nenhum contato foi encontrado ainda. Leia anotações para descobri-los.
    </div>
    
    <div 
      v-else
      v-for="contact in contacts" 
      :key="contact.id" 
      class="contact-item"
      :class="{ 'is-locked': !contact.isUnlocked }"
      @click="contact.isUnlocked ? $emit('contactSelected', contact.id) : null"
    >
      <div class="contact-pfp-container">
        <img v-if="contact.avatar" :src="`./assets/avatars/${contact.avatar}`" :alt="contact.name" />
        <i v-else class="fa-solid fa-user-circle"></i>
      </div>
      <div class="contact-info">
        <div class="contact-name">{{ contact.name }}</div>
        <div class="contact-city">{{ contact.name !== '???' ? contact.cityName : 'Local Desconhecido' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  contacts: {
    type: Array,
    required: true,
  },
});
defineEmits(['contactSelected']);
</script>

<style scoped>
.list-container { padding: 10px; }
.contact-item { display: flex; align-items: center; padding: 15px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; }
.contact-item:hover:not(.is-locked) { background-color: #36393f; }
.contact-item.is-locked { opacity: 0.5; cursor: not-allowed; } /* cursor: not-allowed já ajuda visualmente! */
.contact-pfp-container { width: 50px; height: 50px; border-radius: 50%; overflow: hidden; margin-right: 15px; flex-shrink: 0; display: flex; justify-content: center; align-items: center; background-color: #2c2f33; }
.contact-pfp-container img { width: 100%; height: 100%; object-fit: cover; }
.contact-pfp-container i { font-size: 2.5em; color: #555; }
.contact-name { font-size: 1.1em; font-weight: 500; margin-bottom: 3px; }
.contact-city { font-size: 0.9em; color: var(--color-text-muted); }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-muted); font-style: italic; }
</style>
