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
      entry: ['hideDialogue'], // <-- THE FIX IS HERE
      invoke: {
        id: 'fadeOutScene',
        src: 'fadeOutSceneActor',
        onDone: 'enteringTravelMode',
        onError: {
            target: 'errorState',
            actions: assign({ error: 'Failed to fade out scene.' })
        }
      }
    },
    enteringTravelMode: {
        entry: ['enterTravelMode'],
        always: 'presentingTravelOptions'
    },
    presentingTravelOptions: {
      entry: ['loadTravelOptions'], // 'showInteractions' removed as overlay handles its own reveal
      on: {
        TRAVEL_SELECTED: 'complete',
        NO_MORE_TRAVEL_OPTIONS: 'complete'
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
