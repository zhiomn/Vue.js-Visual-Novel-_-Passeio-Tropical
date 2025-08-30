import { createMachine, assign } from 'xstate';

export const travelMachine = createMachine({
  id: 'travel',
  initial: 'showingConsequence',
  context: ({ input }) => ({
    dialogueSequence: input.dialogueSequence, // Expect an array of strings
    error: null,
  }),
  states: {
    showingConsequence: {
      entry: ['showDialogue'],
      invoke: {
        id: 'speakConsequence',
        src: 'speakSequenceActor',
        input: ({ context }) => ({
            dialogue: context.dialogueSequence
        }),
        onDone: 'enteringTravelMode',
        onError: {
            target: 'errorState',
            actions: assign({ error: 'Failed to speak sequence.' })
        }
      }
    },
fadingOutScene: {      invoke: {        id: 'fadeOutScene',        src: 'fadeOutSceneActor',        onDone: 'enteringTravelMode',        onError: {            target: 'errorState',            actions: assign({ error: 'Failed to fade out scene.' })        }      }    },
    enteringTravelMode: {
        entry: ['enterTravelMode', 'loadTravelOptions'],
        always: 'presentingTravelOptions'
    },
    presentingTravelOptions: {
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
