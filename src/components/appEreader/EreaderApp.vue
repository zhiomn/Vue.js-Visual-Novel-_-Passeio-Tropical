<template>
  <div class="app-container">
    <PhoneAppHeader :title="headerTitle" @back="handleBack" />
    
    <ObraListView 
      v-if="!currentObraId" 
      :obras="contentStore.unlockedObras"
      @obra-selected="openObra" 
    />
    
    <ObraDetailView 
      v-else 
      :obra-id="currentObraId" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import ObraListView from './ObraListView.vue';
import ObraDetailView from './ObraDetailView.vue';

const emit = defineEmits(['back']);
const contentStore = useContentStore();
const currentObraId = ref(null);

function openObra(obraId) {
  currentObraId.value = obraId;
}

function closeObra() {
  currentObraId.value = null;
}

const headerTitle = computed(() => currentObraId.value ? '' : 'Estante');

function handleBack() {
  if (currentObraId.value) {
    closeObra();
  } else {
    emit('back');
  }
}
</script>
