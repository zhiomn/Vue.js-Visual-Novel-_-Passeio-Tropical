<template>
  <div class="app-container" :class="{ 'is-awakening': currentState === 'awakening' }">
    <!-- MODO DESATIVADO PÓS-FINAL -->
    <div v-if="playerStore.hasArchitectAwakened" class="deactivated-container">
      <PhoneAppHeader title="Alarme" @back="$emit('back')" />
      <div class="content-area deactivated-content">
        <i class="fa-solid fa-check-circle deactivated-icon"></i>
        <h2 class="deactivated-title">Despertador Desativado</h2>
        <p class="deactivated-text">Sua função foi cumprida. O arquiteto despertou.</p>
      </div>
    </div>

    <!-- FLUXO NORMAL DO ALARME -->
    <template v-else-if="currentState !== 'awakening'">
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
  border-radius: 0;
}

.deactivated-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.deactivated-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #166534; /* Green-800 from Tailwind */
  color: #dcfce7; /* Green-100 */
  padding: 20px;
}
.deactivated-icon {
  font-size: 5em;
  margin-bottom: 20px;
  opacity: 0.8;
}
.deactivated-title {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0 0 10px 0;
}
.deactivated-text {
  font-size: 1em;
  color: #bbf7d0; /* Green-200 */
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
}
</style>
