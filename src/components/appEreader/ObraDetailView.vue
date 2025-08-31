<template>
  <div class="content-area detail-view-container">
    <!-- 
      THE FIX IS HERE:
      We are replacing the native <iframe> with a specialized
      Vue component that uses pdf.js to render the document.
      This component handles its own loading state.
    -->
    <vue-pdf-embed v-if="obra" :source="obra.pdf_url" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
// Import the new component
import VuePdfEmbed from 'vue-pdf-embed';

const props = defineProps({
  obraId: {
    type: String,
    required: true,
  },
});

const contentStore = useContentStore();

const obra = computed(() => {
  return contentStore.unlockedObras.find(o => o.id === props.obraId);
});

// The custom loading logic (isPdfLoading, onPdfLoad) is no longer needed.
</script>

<style scoped>
/*
  We remove the custom loader styles as they are no longer used.
  The container is kept simple.
*/
.detail-view-container {
  padding: 0;
  /* Make sure the PDF viewer can scroll */
  overflow-y: auto; 
  background-color: #2a2a2e;
}
</style>
