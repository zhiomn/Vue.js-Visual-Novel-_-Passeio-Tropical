<template>
  <div>
    <div 
      v-if="!configStore.phoneOnly"
      id="phone-toggle-btn"
      :class="{ 'has-notification': phoneStore.hasNewAppNotification }"
      @click.stop="phoneStore.togglePhoneVisibility()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></svg>
    </div>

    <div id="phone-ui" :class="{ 'visible': phoneStore.isPhoneVisible }">
      <PhoneStatusBar />

      <div id="phone-home-screen" v-if="!phoneStore.activeApp">
        <PhoneAppIcon 
          v-for="app in apps" 
          :key="app.id"
          :app-name="app.name"
          :app-icon="app.icon"   
          :app-color="getGradientForApp(app)"
          :is-unlocked="isAppEffectivelyUnlocked(app)"
          @open="isAppEffectivelyUnlocked(app) ? phoneStore.openApp(app.id) : null" 
        />
      </div>
      
      <component
        v-else
        :is="appComponentMap[phoneStore.activeApp]"
        @back="phoneStore.closeApp()"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePhoneStore } from '@/stores/phone';
import { useNotificationStore } from '@/stores/notifications';
import { useConfigStore } from '@/stores/config';
import appsData from '@/data/apps.json';

import PhoneStatusBar from './PhoneStatusBar.vue';
import PhoneAppIcon from './PhoneAppIcon.vue';
import MessagesApp from '../appMessages/MessagesApp.vue';
import NotesApp from '../appNotes/NotesApp.vue';
import GalleryApp from '../appGallery/GalleryApp.vue';
import MapApp from '../appMap/MapApp.vue';
import ContactsApp from '../appContacts/ContactsApp.vue';
import AudioApp from '../appAudio/AudioApp.vue';
import EreaderApp from '../appEreader/EreaderApp.vue';
import VideoApp from '../appVideo/VideoApp.vue';
import AlarmApp from '../appDespertador/AlarmApp.vue';
import SettingsApp from '../appAjustes/SettingsApp.vue';
import TerminalApp from '../appTerminal/TerminalApp.vue';
import InfoApp from '../appInfo/InfoApp.vue';

onMounted(() => {
  console.log('[DEBUG_LOG] PhoneUI.vue: Componente Montado.');
});

const phoneStore = usePhoneStore();
const notificationStore = useNotificationStore();
const configStore = useConfigStore();
const apps = appsData;

const disabledInPhoneOnly = ['terminal', 'despertador', 'video', 'info'];

function isAppEffectivelyUnlocked(app) {
  if (configStore.phoneOnly && disabledInPhoneOnly.includes(app.id)) {
    return false;
  }
  return phoneStore.getAppState(app.id).isUnlocked;
}

function getGradientForApp(app) {
  if (!app.colorGradient || app.colorGradient.length < 2) {
    return 'linear-gradient(135deg, #4b5563, #1f2937)';
  }
  const [color1, color2] = app.colorGradient;
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

const appComponentMap = {
  messages: MessagesApp,
  notes: NotesApp,
  gallery: GalleryApp,
  map: MapApp,
  contacts: ContactsApp,
  audio: AudioApp,
  ereader: EreaderApp,
  video: VideoApp,
  despertador: AlarmApp,
  ajustes: SettingsApp,
  terminal: TerminalApp,
  info: InfoApp,
};
</script>

<style scoped>
</style>
