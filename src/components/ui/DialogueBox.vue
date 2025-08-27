<template>
  <div 
    class="dialogue-box-wrapper" 
    :class="{ 'contemplative-mode': isContemplative, 'interactions-visible': areInteractionsVisible && hasInteractions }"
    @click="handleBoxClick"
  >
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

          <template v-if="isContemplative">
            <RevealButton
              v-for="action in interactions.actions" :key="`action-reveal-${action.id}`"
              :text="action.label"
              :disabled="displayStore.isInputLocked"
              @click="$emit('actionExecuted', action)"
            />
            <RevealButton
              v-if="gamePhase === 'ENDING' && !isFinalEnding"
              key="new-run-reveal-btn"
              text="Começar a Próxima Jornada"
              button-class="special-btn"
              :disabled="displayStore.isInputLocked"
              @click="$emit('startNewRun')"
            />
            <RevealButton
              v-if="gamePhase === 'ENDING' && isFinalEnding"
              key="end-game-reveal-btn"
              text="Fim"
              button-class="special-btn"
              :disabled="true"
            />
          </template>

          <template v-else>
            <button
              v-for="choice in interactions.choices" :key="`choice-${choice.id}`"
              class="choice-btn"
              :disabled="displayStore.isInputLocked"
              @click.stop="$emit('choiceSelected', choice.id)"
            >
              {{ choice.escolha }}
            </button>
            <button
              v-for="destination in travelOptions" :key="`travel-${destination}`"
              class="choice-btn travel-btn"
              :disabled="displayStore.isInputLocked"
              @click.stop="$emit('travelSelected', destination)"
            >
              Viajar para {{ destination }}
            </button>
          </template>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNarrationStore } from '@/stores/narration';
import { useDisplayStore } from '@/stores/useDisplayStore';
import TypewriterButton from './TypewriterButton.vue';
import RevealButton from './RevealButton.vue';
import { uiLogger } from '@/utils/loggers/uiLogger';

const narrationStore = useNarrationStore();
const displayStore = useDisplayStore();

const props = defineProps({
  narration: { type: String, default: '' },
  interactions: { type: Object, default: () => ({ choices: [], actions: [] }) },
  travelOptions: { type: Array, default: () => [] },
  gamePhase: { type: String, default: 'IDLE' },
  isFinalEnding: { type: Boolean, default: false },
  areInteractionsVisible: { type: Boolean, default: false }
});

defineEmits(['choiceSelected', 'actionExecuted', 'travelSelected', 'startNewRun']);

const isContemplative = computed(() => props.gamePhase === 'STARTING' || props.gamePhase === 'ENDING');

const hasInteractions = computed(() => 
  (props.interactions?.choices?.length > 0) ||
  (props.interactions?.actions?.length > 0) ||
  (props.travelOptions?.length > 0) ||
  (props.gamePhase === 'ENDING')
);

function handleBoxClick() {
  // Este manipulador agora serve como um fallback se o usuário clicar
  // na área vazia da caixa de diálogo, em vez de diretamente no texto.
  if (props.areInteractionsVisible && hasInteractions.value) {
    return;
  }
  uiLogger.log('Box wrapper clicked, signaling player intent to narrationStore.');
  narrationStore.playerProceed();
}
</script>

<style scoped>
.dialogue-box-wrapper{position:absolute;bottom:0;left:0;width:100%;padding:30px 5%;z-index:10;box-sizing:border-box; cursor: pointer;}
.dialogue-box {background:rgba(18,18,18,.85);border:1px solid var(--color-border);border-radius:15px;padding:25px;min-height:150px;box-shadow:0 -10px 30px rgba(0,0,0,.5);backdrop-filter:blur(10px);position:relative;}
.continue-indicator{position:absolute;bottom:10px;right:25px;font-size:1.5em;color:var(--color-text-muted);animation:pulse 1.5s infinite}@keyframes pulse{0%,100%{opacity:0;transform:translateY(0)}50%{opacity:1;transform:translateY(-5px)}}
.choice-container{display:flex;flex-direction:column;align-items:center;gap:12px; margin-top: 20px;}
.travel-btn{border-color:#4a5a9c}
.dialogue-box-wrapper.interactions-visible { cursor: default; }
</style>
