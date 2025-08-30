<template>
  <div class="contemplative-overlay">
    <Stars />
    <transition name="dialogue-fade">
      <div v-if="displayStore.isDialogueVisible" class="content-wrapper contemplative-mode">
        <TypewriterButton
          v-if="narration"
          :text="narration"
          @animationComplete="narrationStore.markLineAsComplete"
          @requestNextLine="narrationStore.playerProceed"
        />
        <div v-if="narrationStore.awaitingPlayerInput && !hasInteractions" class="continue-indicator">▼</div>

        <div class="choice-container">
          <template v-if="areInteractionsVisible && hasInteractions">
            <RevealButton
              v-for="action in interactions.actions"
              :key="`action-${action.id}`"
              :text="action.label"
              :disabled="displayStore.isInputLocked"
              @click="executeAction(action)"
            />
            
            <!-- THE FIX IS HERE: Conditional rendering for the final button -->
            <template v-if="gamePhase === 'ENDING'">
              <RevealButton
                v-if="!isFinalEnding"
                key="new-run-btn"
                text="...adormecer..."
                :disabled="displayStore.isInputLocked"
                @click="startNextRun()"
              />
              <RevealButton
                v-else
                key="end-game-btn"
                text="...acordar..."
                button-class="special-btn"
                :disabled="displayStore.isInputLocked"
                @click="finishGameAndShowCredits()"
              />
            </template>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNarrationStore } from '@/stores/narration';
import { useDisplayStore } from '@/stores/useDisplayStore';
// Updated imports
import { executeAction, startNextRun, finishGameAndShowCredits } from '@/services/runOrchestrator';
import Stars from '../Stars.vue';
import TypewriterButton from './TypewriterButton.vue';
import RevealButton from './RevealButton.vue';

const narrationStore = useNarrationStore();
const displayStore = useDisplayStore();

const props = defineProps({
  narration: String,
  interactions: Object,
  gamePhase: String,
  isFinalEnding: Boolean,
  areInteractionsVisible: Boolean,
});

const hasInteractions = computed(() =>
  (props.interactions?.actions?.length > 0) || props.gamePhase === 'ENDING'
);
</script>

<style scoped>
.contemplative-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}
.content-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: var(--color-text-primary);
}
.choice-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.continue-indicator{ font-size:1.5em; color:var(--color-text-muted); animation:pulse 1.5s infinite; margin-top: 1rem; }
@keyframes pulse{ 0%,100%{ opacity:0 } 50%{ opacity:1 } }
</style>
