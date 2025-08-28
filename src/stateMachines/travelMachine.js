import { createMachine, assign } from 'xstate';

export const travelMachine = createMachine({
  id: 'travel',
  initial: 'showingConsequence',
  context: ({ input }) => ({
    escolha: input.escolha,
    error: null,
  }),
  states: {
    showingConsequence: {
      entry: ['showDialogue'],
      invoke: {
        id: 'speakConsequence',
        src: 'speakSequenceActor',
        input: ({ context }) => ({
            dialogue: [context.escolha.msg_antes || "Você descobriu algo novo..."]
        }),
        onDone: 'fadingOutScene',
        onError: {
            target: 'errorState',
            actions: assign({ error: 'Failed to speak consequence.' })
        }
      }
    },
    fadingOutScene: {
      invoke: {
        id: 'fadeOutScene',
        src: 'fadeOutSceneActor',
        onDone: 'presentingTravelOptions',
        onError: {
            target: 'errorState',
            actions: assign({ error: 'Failed to fade out scene.' })
        }
      }
    },
    presentingTravelOptions: {
      entry: ['loadTravelOptions', 'showInteractions'],
      on: {
        TRAVEL_SELECTED: 'complete',
        NO_MORE_TRAVEL_OPTIONS: 'complete' // A máquina termina, o orquestrador decide ir para o final.
      }
    },
    complete: {
      type: 'final'
    },
    errorState: {
      type: 'final'
    }
  }
});
