<template>
  <div v-if="location" class="content-area detail-container">
    <div class="hero-image">
      <img v-if="location.foto" :src="`./assets/images/cities/${location.foto}`" :alt="location.nome" />
      <div v-else class="image-placeholder">
        <i class="fa-solid fa-earth-americas"></i>
      </div>
    </div>
    
    <div class="location-header">
      <h2>{{ location.nome }}</h2>
      <p>{{ location.estado ? `${location.estado}, ` : '' }}{{ location.pais }}</p>
    </div>

    <div v-if="location.texto" class="description">
      <p>{{ location.texto }}</p>
    </div>

    <div class="authors-section">
      <h3>Contatos nascidos aqui</h3>
      <ul v-if="peopleFromHere.length > 0">
        <li v-for="person in peopleFromHere" :key="person.id">
          {{ person.name }} ({{ person.types.join(', ') }})
        </li>
      </ul>
      <p v-else class="no-authors">Ninguém conhecido desta região foi encontrado ainda.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import cidadesData from '@/data/cidades.json';

const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
});

const contentStore = useContentStore();

const location = computed(() => {
  return cidadesData.find(c => c.id === props.cityId);
});

const peopleFromHere = computed(() => {
  if (!props.cityId) return [];
  // Search through all unlocked contacts (authors and painters)
  return contentStore.unlockedContacts.filter(contact => contact.cityId === props.cityId && contact.isUnlocked);
});
</script>

<style scoped>
.detail-container {
  padding: 0;
}
.hero-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #2c2f33;
}
.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4em;
  color: #444;
}
.location-header {
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid var(--color-border);
}
.location-header h2 {
  margin: 0 0 5px 0;
  font-size: 1.8em;
}
.location-header p {
  margin: 0;
  font-size: 1.1em;
  color: var(--color-text-muted);
}
.description {
  padding: 20px;
  line-height: 1.6;
}
.authors-section {
  padding: 10px 20px 20px 20px;
}
.authors-section h3 {
  font-size: 1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
  margin-bottom: 15px;
}
.authors-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.authors-section li {
  background-color: #2c2f33;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 8px;
}
.no-authors {
  font-style: italic;
  color: var(--color-text-muted);
}
</style>
