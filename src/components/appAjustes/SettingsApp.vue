<template>
  <div class="app-container">
    <PhoneAppHeader title="Ajustes" @back="$emit('back')" />

    <div class="content-area">
      <div v-for="(settings, group) in groupedSettings" :key="group" class="settings-group">
        <h2 class="group-title">{{ group }}</h2>
        
        <div v-for="(settingObject, key) in settings" :key="key" class="setting-control">
          <label :for="key">{{ settingObject.label }}</label>

          <!-- Render Custom Slider -->
          <CustomSlider
            v-if="settingObject.hasOwnProperty('min')"
            :id="key"
            :min="settingObject.min"
            :max="settingObject.max"
            :step="settingObject.step"
            :modelValue="settingObject.value"
            @update:modelValue="handleUpdate(key, $event)"
            @input="handleInput(key, $event)"
          />

          <!-- Render Segmented Control -->
          <SegmentedControl
            v-else-if="settingObject.hasOwnProperty('options')"
            :id="key"
            :options="settingObject.options"
            :modelValue="settingObject.value"
            @update:modelValue="handleUpdate(key, $event)"
          />
          
          <!-- Text Speed Preview -->
          <TypewriterPreview 
            v-if="key === 'textSpeed'"
            :text="settingObject.previewText"
            :speed="settingObject.value"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useAudioStore } from '@/stores/audio';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import CustomSlider from './CustomSlider.vue';
import SegmentedControl from './SegmentedControl.vue';
import TypewriterPreview from './TypewriterPreview.vue';

const configStore = useConfigStore();
const audioStore = useAudioStore();
defineEmits(['back']);

const groupedSettings = computed(() => {
  return Object.entries(configStore.settings).reduce((acc, [key, setting]) => {
    const group = setting.group || 'Geral';
    if (!acc[group]) acc[group] = {};
    acc[group][key] = setting;
    return acc;
  }, {});
});

function handleUpdate(key, value) {
  configStore.updateSetting({ key, value });
  configStore.saveSettingsToLocalStorage();
}

function handleInput(key, value) {
  // For real-time feedback while dragging
  configStore.updateSetting({ key, value });
  
  if (key === 'musicVolume' || key === 'sfxVolume') {
    audioStore.playSfxSample(value);
  }
}
</script>

<style scoped>
.content-area{padding:20px}.settings-group{margin-bottom:30px}.group-title{font-size:.9em;text-transform:uppercase;color:var(--color-text-muted);border-bottom:1px solid var(--color-border);padding-bottom:8px;margin:0 0 20px}.setting-control{margin-bottom:25px}label{display:block;margin-bottom:12px;font-size:1em;color:var(--color-text-primary);font-weight:500}
</style>
