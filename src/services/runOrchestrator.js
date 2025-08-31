import { createActor, assign, fromPromise } from 'xstate';
import { usePlayerStore } from '@/stores/player';
import { useNarrationStore } from '@/stores/narration';
import { useDisplayStore } from '@/stores/useDisplayStore';
import { useRunStore } from '@/stores/useRunStore';
import { usePhoneStore } from '@/stores/phone';
import { useReadStatusStore } from '@/stores/readStatus'; // <-- IMPORT ADICIONADO
import { getStartingSequence } from '@/gameLogic/run/start';
import { getAvailableChoices, getRandomScene, getTravelOptions } from '@/gameLogic/run/explore';
import { getEndingSequence } from '@/gameLogic/run/end';
import { getStartActions, getSceneActions } from '@/gameLogic/run/actions';
import { getNewlyUnlockedContent } from '@/gameLogic/unlocks/unlocksService';
import { jsonDbService } from '@/services/jsonDbService';
import { runStartMachine } from '@/stateMachines/runStartMachine';
import { travelMachine } from '@/stateMachines/travelMachine';
import { createLogger } from '@/utils/loggers/loggerFactory';

const logger = createLogger('RunOrchestrator', '#d946ef');

const APP_UNLOCK_MESSAGE_SUPPRESS_LIST = [
  'contacts',
  'map',
  'info',
  'audio',
  'ereader',
  'video',
  'despertador'
];

let runStartActor = null;
let travelActor = null;

async function _transitionToScene(sceneName) {
    const displayStore = useDisplayStore();
    const narrationStore = useNarrationStore();
    const playerStore = usePlayerStore();
    const runStore = useRunStore();
    const readStatusStore = useReadStatusStore(); // <-- INSTÂNCIA DA STORE OBTIDA

    logger.group(`Orchestrating robust transition to scene: ${sceneName}`);

    playerStore.setNarrationState({ lineQueue: [], currentLine: '' });
    playerStore.awaitingTravelPrompt = false;
    const sceneData = jsonDbService.findCenaByName(sceneName);
    if (!sceneData) {
        logger.error(`Scene data for '${sceneName}' not found!`);
        logger.groupEnd();
        return;
    }
    
    // --- A CORREÇÃO ESTÁ AQUI ---
    // A visita à cena agora é marcada permanentemente para desbloquear conteúdo.
    readStatusStore.markSceneAsViewed(sceneData.id);

    runStore.setCurrentScene(sceneData);
    runStore.setTravelOptions([]);
    playerStore.lastSceneName = sceneName;
    playerStore.saveProgress();

    await displayStore.animateSceneFadeIn();
    
    runStore.setGamePhase('EXPLORING');
    displayStore.setDialogueVisibility(true);

    const narrationText = playerStore.runCount > 1 && sceneData.msg_javisitou
      ? sceneData.msg_javisitou
      : sceneData.msg_entrada || `Você chegou em ${sceneData.nome}.`;

    await narrationStore.speak([narrationText]);
    
    const choices = getAvailableChoices(sceneName, playerStore.unlockedEscolhaIds);
    const actions = getSceneActions(sceneName);
    runStore.setInteractions({ choices, actions });
    displayStore.setInteractionsVisibility(true);
    
    logger.groupEnd();
}

function _startTravelSequence(dialogueSequence) {
    const displayStore = useDisplayStore();
    const narrationStore = useNarrationStore();
    const runStore = useRunStore();
    const playerStore = usePlayerStore();

    if (travelActor) travelActor.stop();

    const machine = travelMachine.provide({
        actors: {
            speakSequenceActor: fromPromise(({ input }) => narrationStore.speak(input.dialogue)),
fadeOutSceneActor: fromPromise(() => displayStore.animateSceneFadeOut()),
        },
        actions: {
            showDialogue: () => displayStore.setDialogueVisibility(true),
            hideDialogue: () => displayStore.setDialogueVisibility(false),
            enterTravelMode: () => runStore.setGamePhase('TRAVELING'),
            loadTravelOptions: () => {
                runStore.setInteractions({ choices: [], actions: [] });
                const travelOptions = getTravelOptions(playerStore.visitedScenesInThisRun);
                runStore.setTravelOptions(travelOptions);
                if (travelOptions.length === 0) {
                    setTimeout(() => travelActor.send({ type: 'NO_MORE_TRAVEL_OPTIONS' }), 10);
                }
            }
        }
    });

    travelActor = createActor(machine, { input: { dialogueSequence } });
    travelActor.subscribe(handleTravelSnapshot);
    travelActor.start();
}


export function resumeGameSession() {
    const playerStore = usePlayerStore();
    logger.log(`Resuming game session for Run #${playerStore.runCount}`);
    if (playerStore.runCount === 0) playerStore.startNewRun();

    if (playerStore.gamePhase === 'EXPLORING' && playerStore.lastSceneName) {
        logger.log(`Resuming directly into EXPLORING phase at scene: ${playerStore.lastSceneName}`);
        resumeExploring(playerStore.lastSceneName);
    } else {
        logger.log('No exploration state found. Initializing run start sequence.');
        initializeRunStartLogic();
    }
}

async function resumeExploring(sceneName) {
    const playerStore = usePlayerStore();
    const runStore = useRunStore();
    const displayStore = useDisplayStore();
    const narrationStore = useNarrationStore();

    runStore.setGamePhase('EXPLORING');

    const sceneData = jsonDbService.findCenaByName(sceneName);
    runStore.setCurrentScene(sceneData);

    displayStore.setDialogueVisibility(true);

    if (playerStore.narrationState && playerStore.narrationState.currentLine) {
        narrationStore.rehydrate(playerStore.narrationState);
    } else {
      const narrationText = playerStore.runCount > 1 && sceneData.msg_javisitou
        ? sceneData.msg_javisitou
        : sceneData.msg_entrada || `Você chegou em ${sceneData.nome}.`;
      await narrationStore.speak([narrationText]);
    }
    
    if (playerStore.awaitingTravelPrompt) {
        logger.log('Resuming in post-choice state. Triggering travel sequence.');
        displayStore.setInteractionsVisibility(false);
        _startTravelSequence([playerStore.narrationState.currentLine]);
    } else {
        logger.log('Resuming in standard scene state. Loading choices.');
        const choices = getAvailableChoices(sceneName, playerStore.unlockedEscolhaIds);
        const actions = getSceneActions(sceneName);
        runStore.setInteractions({ choices, actions });
        displayStore.setInteractionsVisibility(true);
    }
}

function initializeRunStartLogic() {
    logger.group('Orchestrating run start logic...');
    const playerStore = usePlayerStore();
    const runStore = useRunStore();
    const narrationStore = useNarrationStore();
    const displayStore = useDisplayStore();
    
    runStore.$reset();
    runStore.setGamePhase('STARTING');
    if (runStartActor) runStartActor.stop();

    const machine = runStartMachine.provide({
        actors: {
            loadInitialDataActor: fromPromise(({ input }) => Promise.resolve(getStartingSequence(input.runCount))),
            speakSequenceActor: fromPromise(({ input }) => narrationStore.speak(input.dialogue)),
fadeOutSceneActor: fromPromise(() => displayStore.animateSceneFadeOut()),
        },
        actions: {
            fadeInScene: () => {},
            showDialogue: () => displayStore.setDialogueVisibility(true),
            showInteractions: () => displayStore.setInteractionsVisibility(true),
            loadStartActions: assign({ actions: ({ context }) => getStartActions(context.runCount) }),
        }
    });

    runStartActor = createActor(machine, { input: { runCount: playerStore.runCount } });
    runStartActor.subscribe(handleRunStartSnapshot);
    runStartActor.start();
}

async function handleRunStartSnapshot(snapshot) {
    const runStore = useRunStore();
    const displayStore = useDisplayStore();

    logger.log(`[XState:runStart] Snapshot: ${snapshot.value}`, { context: snapshot.context });
    runStore.setCurrentScene(snapshot.context.sequence);
    runStore.setInteractions({ choices: [], actions: snapshot.context.actions });

    if (snapshot.matches('presentingScene')) {
        await displayStore.waitFor(700);
        runStartActor.send({ type: 'SCENE_READY' });
    }
    
    if (snapshot.status === 'done') {
        logger.log(`[XState:runStart] Actor finished in state: ${snapshot.value}`);
        logger.groupEnd();
        if (snapshot.matches('runStarted')) {
            const startAction = runStore.availableInteractions.actions[0];
            if (startAction) executeAction(startAction);
        }
    }
}

export async function selectChoice(escolhaId) {
    const displayStore = useDisplayStore();
    const phoneStore = usePhoneStore();
    await displayStore.withInputLock(async () => {
        logger.group(`Orchestrating choice selection: ${escolhaId}`);
        
        displayStore.setDialogueVisibility(false);
        displayStore.setInteractionsVisibility(false);

        const playerStore = usePlayerStore();
        playerStore.unlockChoice(escolhaId);

        const runStore = useRunStore();
        playerStore.addVisitedScene(runStore.currentScene.nome);
        
        const newlyUnlocked = getNewlyUnlockedContent();
        const dialogueSequence = [];
        const escolha = jsonDbService.findEscolhaById(escolhaId);
        if (escolha.msg_antes) {
            dialogueSequence.push(escolha.msg_antes);
        }

        let shouldTriggerNotification = false;
        newlyUnlocked.forEach(item => {
            if (item.unlockMessage) {
                dialogueSequence.push(item.unlockMessage.replace('[AppName]', item.name));
            }

            if (item.type === 'ai' || (item.type === 'app' && !APP_UNLOCK_MESSAGE_SUPPRESS_LIST.includes(item.id))) {
                shouldTriggerNotification = true;
            }
        });

        if (shouldTriggerNotification) {
            phoneStore.setNewAppNotification();
        }

        playerStore.awaitingTravelPrompt = true;
        _startTravelSequence(dialogueSequence);
    });
}

async function handleTravelSnapshot(snapshot) {
    logger.log(`[XState:travel] Snapshot: ${snapshot.value}`);
    if (snapshot.status === 'done') {
        logger.log(`[XState:travel] Actor finished.`);
        const playerStore = usePlayerStore();
        const travelOptions = getTravelOptions(playerStore.visitedScenesInThisRun);
        if (travelOptions.length === 0) {
            await transitionToEnding();
        }
        logger.groupEnd();
    }
}

export async function travelToScene(sceneName) {
    const displayStore = useDisplayStore();
    const runStore = useRunStore(); 
    await displayStore.withInputLock(async () => {
        runStore.setTravelOptions([]);
        await _transitionToScene(sceneName);
    });
}

export async function executeAction(action) {
    const displayStore = useDisplayStore();
    await displayStore.withInputLock(async () => {
        logger.log(`Orchestrating action execution: ${action.id || action.type}`, action);
        displayStore.setInteractionsVisibility(false);
        await displayStore.waitFor(400);

        if (action.type === 'transition' && action.payload.targetPhase === 'EXPLORING') {
            const playerStore = usePlayerStore();
            
            playerStore.gamePhase = 'EXPLORING';
            
            const randomScene = getRandomScene(playerStore.visitedScenesInThisRun);
            if (randomScene) {
                await _transitionToScene(randomScene.nome);
            } else {
                await transitionToEnding();
            }
        }
    });
}

export async function startNextRun() {
    const playerStore = usePlayerStore();
    const displayStore = useDisplayStore();
    await displayStore.withInputLock(async () => {
        logger.log(`Starting NEXT run. Current run: ${playerStore.runCount}`);
        
        useRunStore().$reset();
        playerStore.startNewRun();
        playerStore.saveProgress();
        initializeRunStartLogic();
    });
}

export async function finishGameAndShowCredits() {
    const playerStore = usePlayerStore();
    const displayStore = useDisplayStore();
    await displayStore.withInputLock(async () => {
        logger.log("Final game sequence triggered.");
        playerStore.finishGame();
        displayStore.setDialogueVisibility(false);
    });
}

async function transitionToEnding() {
    logger.group('Orchestrating end of run sequence...');
    const playerStore = usePlayerStore();
    const narrationStore = useNarrationStore();
    const displayStore = useDisplayStore();
    const runStore = useRunStore();

    runStore.setGamePhase('ENDING');
    playerStore.gamePhase = 'ENDING';
    playerStore.lastSceneName = null;
    playerStore.awaitingTravelPrompt = false;
    playerStore.saveProgress();

    displayStore.setInteractionsVisibility(false);
    await displayStore.waitFor(400);

    const sequence = getEndingSequence(playerStore.runCount);
    runStore.setCurrentScene(sequence);
    runStore.isFinalEnding = playerStore.isGameComplete;
    
    displayStore.setDialogueVisibility(true);
    await narrationStore.speak(sequence.narration);
    
    displayStore.setInteractionsVisibility(true);
    logger.groupEnd();
}
