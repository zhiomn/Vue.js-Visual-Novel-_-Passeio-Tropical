<template>
  <div class="dialogue-box-wrapper" @click="handleBoxClick">
    <div class="dialogue-box">
      <TypewriterButton
        v-if="narration"
        :text="narration"
        @animationComplete="narrationStore.markLineAsComplete"
        @requestNextLine="narrationStore.playerProceed"
      />
      <div v-if="narrationStore.awaitingPlayerInput && !hasInteractions" class="continue-indicator">▼</div>
      <div class="choice-container">
        <template v-if="areInteractionsVisible && hasInteractions">
          <button
            v-for="choice in interactions.choices"
            :key="`choice-${choice.id}`"
            class="choice-btn"
            :disabled="displayStore.isInputLocked"
            @click.stop="selectChoice(choice.id)"
          >
            {{ choice.escolha }}
          </button>
          <button
            v-for="destination in travelOptions"
            :key="`travel-${destination}`"
            class="choice-btn travel-btn"
            :disabled="displayStore.isInputLocked"
            @click.stop="travelToScene(destination)"
          >
            Viajar para {{ destination }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNarrationStore } from '@/stores/narration';
import { useDisplayStore } from '@/stores/useDisplayStore';
import { selectChoice, travelToScene } from '@/services/runOrchestrator';
import TypewriterButton from './TypewriterButton.vue';

const narrationStore = useNarrationStore();
const displayStore = useDisplayStore();

const props = defineProps({
  narration: String,
  interactions: Object,
  travelOptions: Array,
  areInteractionsVisible: Boolean,
});

const hasInteractions = computed(() =>
  (props.interactions?.choices?.length > 0) || (props.travelOptions?.length > 0)
);

function handleBoxClick() {
  if (props.areInteractionsVisible && hasInteractions.value) {
    return;
  }
  narrationStore.playerProceed();
}
</script>

<style scoped>
.dialogue-box-wrapper{position:absolute;bottom:0;left:0;width:100%;padding:30px 5%;z-index:10;box-sizing:border-box; cursor: pointer;}
.dialogue-box {background:rgba(18,18,18,.85);border:1px solid var(--color-border);border-radius:15px;padding:25px;min-height:150px;box-shadow:0 -10px 30px rgba(0,0,0,.5);backdrop-filter:blur(10px);position:relative;}
.continue-indicator{position:absolute;bottom:10px;right:25px;font-size:1.5em;color:var(--color-text-muted);animation:pulse 1.5s infinite}@keyframes pulse{0%,100%{opacity:0;transform:translateY(0)}50%{opacity:1;transform:translateY(-5px)}}
.choice-container{display:flex;flex-direction:column;align-items:center;gap:12px; margin-top: 20px;}
.travel-btn{border-color:#4a5a9c}
</style>
