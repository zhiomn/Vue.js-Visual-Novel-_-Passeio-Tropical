import { createMachine, assign } from 'xstate';
import { getStartingSequence } from '@/gameLogic/run/start';
import { getStartActions } from '@/gameLogic/run/actions';

export const runStartMachine = createMachine({
  id: 'runStart',
  initial: 'initializing',
  // O contexto agora é uma função que recebe o 'input' inicial do ator
  context: ({ input }) => ({
    runCount: input.runCount,
    sequence: null,
    actions: [],
    error: null,
  }),
  states: {
    initializing: {
      invoke: {
        id: 'loadInitialData',
        src: 'loadInitialDataActor',
        input: ({ context }) => ({
          runCount: context.runCount
        }),
        onDone: {
          target: 'presentingScene',
          actions: assign({
            sequence: ({ event }) => event.output,
          }),
        },
        onError: {
          target: 'gameComplete',
          actions: assign({
            error: 'No start sequence found.',
          }),
        },
      },
    },
    presentingScene: {
      entry: ['fadeInScene', 'showDialogue'],
      on: {
        SCENE_READY: 'narrating',
      },
    },
    narrating: {
      invoke: {
        id: 'speakNarration',
        src: 'speakSequenceActor',
        input: ({ context }) => ({
            dialogue: context.sequence.dialogue
        }),
        onDone: {
          target: 'awaitingAction',
        },
        onError: {
          target: 'errorState',
          actions: assign({ error: ({ event }) => event.data }),
        },
      },
    },
    awaitingAction: {
      entry: ['loadStartActions', 'showInteractions'],
      on: {
        ACTION_EXECUTED: 'runStarted',
      },
    },
    runStarted: {
      type: 'final',
    },
    gameComplete: {
      type: 'final',
    },
    errorState: {
      type: 'final',
    },
  },
});
