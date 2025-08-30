<template>
  <div class="app-container" :class="{ 'is-awakening': currentState === 'awakening' }">
    <template v-if="currentState !== 'awakening'">
      <PhoneAppHeader title="Alarme" @back="$emit('back')" />
      <div class="content-area alarm-ringing-bg">
        
        <div v-if="currentState === 'ringing'" class="alarm-content">
          <button class="alarm-button" @click="currentState = 'confirming'">
            <i class="fa-solid fa-bell"></i>
          </button>
          <span class="alarm-label">Desativar Alarme</span>
        </div>

        <div v-if="currentState === 'confirming'" class="confirmation-content">
          <i class="fa-solid fa-triangle-exclamation warning-icon"></i>
          <p class="confirmation-text">Tem certeza?</p>
          <div class="confirmation-buttons">
            <button @click="triggerAwakening">[ Sim ]</button>
            <button @click="currentState = 'ringing'">[ Não ]</button>
          </div>
        </div>

      </div>
    </template>

    <AwakeningSequence 
      v-if="currentState === 'awakening'"
      :duration="4000"
      @sequence-complete="onSequenceComplete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { usePhoneStore } from '@/stores/phone';
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import AwakeningSequence from './AwakeningSequence.vue';

const emit = defineEmits(['back']);
const playerStore = usePlayerStore();
const phoneStore = usePhoneStore();

const currentState = ref('ringing'); // 'ringing', 'confirming', 'awakening'

function triggerAwakening() {
  playerStore.awakenArchitect();
  playerStore.saveProgress();
  currentState.value = 'awakening';
}

function onSequenceComplete() {
  phoneStore.closeApp();
}
</script>

<style scoped>
.app-container.is-awakening {
  border-radius: 0; /* Ocupa a tela inteira */
}
</style>
