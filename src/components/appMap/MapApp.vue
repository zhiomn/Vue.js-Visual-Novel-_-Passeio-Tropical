<template>
  <div class="app-container">
    <PhoneAppHeader :title="headerTitle" @back="handleBack" />
    
    <MapListView 
      v-if="!currentCityId" 
      :locations="contentStore.unlockedMapLocations"
      @location-selected="openLocation" 
    />
    
    <MapDetailView 
      v-else 
      :city-id="currentCityId" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import MapListView from './MapListView.vue';
import MapDetailView from './MapDetailView.vue';

const emit = defineEmits(['back']);

const contentStore = useContentStore();
const currentCityId = ref(null);

function openLocation(cityId) {
  currentCityId.value = cityId;
}

function closeLocation() {
  currentCityId.value = null;
}

const headerTitle = computed(() => currentCityId.value ? '' : 'Mapa');

function handleBack() {
  if (currentCityId.value) {
    closeLocation();
  } else {
    emit('back');
  }
}
</script>
