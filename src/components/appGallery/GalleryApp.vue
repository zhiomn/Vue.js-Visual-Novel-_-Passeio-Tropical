<template>
  <div class="app-container">
    <PhoneAppHeader :title="headerTitle" @back="handleBack" />

    <!-- Evolved UI for Run 2+ -->
    <template v-if="galleryData.showFolderView">
      <GalleryFolderView
        v-if="viewMode === 'folders'"
        :revistas="galleryData.revistas"
        :pinturas="galleryData.pinturas"
        @folder-selected="openFolder"
      />
      <GalleryGridView
        v-else-if="viewMode === 'revistas'"
        :items="galleryData.revistas"
        @item-selected="openLightbox"
      />
      <GalleryGridView
        v-else-if="viewMode === 'pinturas'"
        :items="galleryData.pinturas"
        @item-selected="openLightbox"
      />
    </template>

    <!-- Simple UI for Run 1 -->
    <template v-else>
      <GalleryGridView
        :items="galleryData.revistas"
        @item-selected="openLightbox"
      />
    </template>
    
    <!-- Lightbox is always shown conditionally on top -->
    <GalleryLightboxView 
      v-if="currentItemId" 
      :item-id="currentItemId"
      :item-type="currentItemType"
      @close="closeLightbox"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '@/stores/contentStore';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import GalleryGridView from './GalleryGridView.vue';
import GalleryLightboxView from './GalleryLightboxView.vue';
import GalleryFolderView from './GalleryFolderView.vue';

const emit = defineEmits(['back']);
const contentStore = useContentStore();

const viewMode = ref('folders'); // 'folders', 'revistas', 'pinturas'
const currentItemId = ref(null);
const currentItemType = ref(null);

const galleryData = computed(() => contentStore.galleryContent);

const headerTitle = computed(() => {
  if (!galleryData.value.showFolderView || viewMode.value === 'folders') {
    return 'Galeria';
  }
  return viewMode.value.charAt(0).toUpperCase() + viewMode.value.slice(1);
});

function openFolder(folderName) {
  viewMode.value = folderName;
}

function openLightbox(item) {
  currentItemId.value = item.id;
  currentItemType.value = item.type;
}

function closeLightbox() {
  currentItemId.value = null;
  currentItemType.value = null;
}

function handleBack() {
  if (galleryData.value.showFolderView && viewMode.value !== 'folders') {
    viewMode.value = 'folders';
  } else {
    emit('back');
  }
}
</script>
