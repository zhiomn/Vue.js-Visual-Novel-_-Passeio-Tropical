import { createActor, assign, fromPromise } from 'xstate';
import { usePlayerStore } from '@/stores/player';
import { useNarrationStore } from '@/stores/narration';
import { useDisplayStore } from '@/stores/useDisplayStore';
import { useReadStatusStore } from '@/stores/readStatus';
import { useRunStore } from '@/stores/useRunStore';
import { getStartingSequence } from '@/gameLogic/run/start';
import { getAvailableChoices, getRandomScene, getTravelOptions } from '@/gameLogic/run/explore';
import { getEndingSequence } from '@/gameLogic/run/end';
import { getStartActions, getSceneActions } from '@/gameLogic/run/actions';
import { jsonDbService } from '@/services/jsonDbService';
import { runStartMachine } from '@/stateMachines/runStartMachine';
import { createLogger } from '@/utils/loggers/loggerFactory';

const logger = createLogger('RunOrchestrator', '#d946ef');

let runMachineActor = null;

function initializeRunLogic() {
    logger.group('Orquestrando lógica de início de run...');
    const playerStore = usePlayerStore();
    const narrationStore = useNarrationStore();
    const displayStore = useDisplayStore();
    const runStore = useRunStore();

    runStore.gamePhase = 'STARTING';

    if (runMachineActor) runMachineActor.stop();

    if (playerStore.isGameComplete) {
        logger.log('Jogo já concluído. Pulando para a sequência final.');
        logger.groupEnd();
        return handleTransitionToEnding();
    }
    
    const machine = runStartMachine.provide({
        actors: {
            loadInitialDataActor: fromPromise(({ input }) => Promise.resolve(getStartingSequence(input.runCount))),
            speakSequenceActor: fromPromise(({ input }) => narrationStore.speak(input.dialogue)),
        },
        actions: {
            fadeInScene: () => displayStore.animateSceneFadeIn(),
            showDialogue: () => displayStore.setDialogueVisibility(true),
            showInteractions: () => displayStore.setInteractionsVisibility(true),
            loadStartActions: assign({ actions: ({ context }) => getStartActions(context.runCount) }),
        }
    });

    runMachineActor = createActor(machine, { input: { runCount: playerStore.runCount } });

    runMachineActor.subscribe(async (snapshot) => {
        logger.log(`[XState] Snapshot: ${snapshot.value}`, { context: snapshot.context });
        
        runStore.currentScene = snapshot.context.sequence;
        runStore.availableInteractions.actions = snapshot.context.actions;

        if (snapshot.matches('presentingScene')) {
            await displayStore.waitFor(700);
            runMachineActor.send({ type: 'SCENE_READY' });
        }
        
        if (snapshot.status === 'done') {
            logger.log(`[XState] Ator finalizado no estado: ${snapshot.value}`);
            logger.groupEnd();
            if (snapshot.matches('runStarted')) {
                const startAction = runStore.availableInteractions.actions[0];
                if (startAction) runStore.executeAction(startAction);
            } else if (snapshot.matches('gameComplete')) {
                await handleTransitionToEnding();
            }
        }
    });

    runMachineActor.start();
}

// --- LÓGICA DE RETOMADA INTELIGENTE ---
export function handleResumeGameSession() {
    const playerStore = usePlayerStore();
    logger.log(`Resumindo sessão de jogo para a Run #${playerStore.runCount}`);
    if (playerStore.runCount === 0) {
        playerStore.startNewRun();
    }

    // A bifurcação principal: retomar na exploração ou começar do início?
    if (playerStore.gamePhase === 'EXPLORING' && playerStore.lastSceneName) {
        logger.log(`Retomando diretamente na fase de EXPLORING na cena: ${playerStore.lastSceneName}`);
        handleResumeExploring(playerStore.lastSceneName);
    } else {
        logger.log('Nenhum estado de exploração encontrado. Iniciando a sequência de introdução da run.');
        initializeRunLogic();
    }
}

async function handleResumeExploring(sceneName) {
    const runStore = useRunStore();
    runStore.gamePhase = 'EXPLORING'; // Sincroniza a runStore volátil
    await handleTravelToScene(sceneName);
}
// --- FIM DA LÓGICA DE RETOMADA ---

export async function handleStartNextRun() {
    const playerStore = usePlayerStore();
    const runStore = useRunStore();
    logger.log(`Iniciando a PRÓXIMA run. Run atual: ${playerStore.runCount}`);

    if (playerStore.isGameComplete) {
        logger.warn("Tentativa de iniciar uma nova run quando o jogo já está completo.");
        await handleTransitionToEnding();
        return;
    }
    
    runStore.$reset();
    playerStore.startNewRun();
    playerStore.saveProgress();
    initializeRunLogic();
}

export async function handleTravelToScene(sceneName) {
    logger.group(`Orquestrando viagem para a cena: ${sceneName}`);
    const displayStore = useDisplayStore();
    const narrationStore = useNarrationStore();
    const playerStore = usePlayerStore();
    const readStatusStore = useReadStatusStore();
    const runStore = useRunStore();

    displayStore.setInteractionsVisibility(false);
    
    const sceneData = jsonDbService.findCenaByName(sceneName);
    if (!sceneData) {
      logger.error(`Dados da cena '${sceneName}' não encontrados!`);
      logger.groupEnd();
      return;
    }

    readStatusStore.markSceneAsViewed(sceneData.id);
    runStore.currentScene = sceneData;
    runStore.availableInteractions = { choices: [], actions: [] };
    runStore.travelOptions = []; 

    // --- SINCRONIZAR ESTADO PERSISTENTE ---
    playerStore.gamePhase = 'EXPLORING';
    playerStore.lastSceneName = sceneName;
    playerStore.saveProgress();
    // --- FIM DA SINCRONIZAÇÃO ---

    await displayStore.animateSceneFadeIn();
    const narrationText = runStore.currentScene.msg_entrada || `Você chegou em ${runStore.currentScene.nome}.`;
    await narrationStore.speak([narrationText]);

    runStore.availableInteractions.choices = getAvailableChoices(sceneName, playerStore.unlockedEscolhaIds);
    runStore.availableInteractions.actions = getSceneActions(sceneName);
    
    displayStore.setInteractionsVisibility(true);
    logger.groupEnd();
}

export async function handleSelectChoice(escolhaId) {
    logger.group(`Orquestrando processamento da escolha: ${escolhaId}`);
    const playerStore = usePlayerStore();
    const narrationStore = useNarrationStore();
    const readStatusStore = useReadStatusStore();
    const runStore = useRunStore();
    const displayStore = useDisplayStore();

    displayStore.setInteractionsVisibility(false);
    await displayStore.waitFor(400);

    playerStore.unlockChoice(escolhaId);
    
    runStore.visitedScenesInThisRun.push(runStore.currentScene.nome);
    runStore.availableInteractions = { choices: [], actions: [] };
    
    // Salva o progresso *após* a escolha ser adicionada, mas *antes* de qualquer nova cena ser definida
    playerStore.saveProgress();
    readStatusStore.saveReadStatus();

    const escolha = jsonDbService.findEscolhaById(escolhaId);
    const narrationText = escolha.msg_antes || "Você descobriu algo novo...";
    await narrationStore.speak([narrationText]);
    
    await displayStore.animateSceneFadeOut();
    await handlePresentTravelOptions();
    logger.groupEnd();
}

export async function handleExecuteAction(action) {
    logger.log(`Orquestrando execução da ação: ${action.id || action.type}`, action);
    const runStore = useRunStore();
    const playerStore = usePlayerStore();
    const displayStore = useDisplayStore();

    displayStore.setInteractionsVisibility(false);
    await displayStore.waitFor(400);

    if (action.type === 'transition' && action.payload.targetPhase === 'EXPLORING') {
        runStore.gamePhase = 'EXPLORING';
        playerStore.gamePhase = 'EXPLORING'; // Manter o estado persistente sincronizado
        logger.log(`Transição de Fase: STARTING -> EXPLORING`);
        const randomScene = getRandomScene(runStore.visitedScenesInThisRun);
        if (randomScene) {
            await handleTravelToScene(randomScene.nome);
        } else {
            await handleTransitionToEnding();
        }
    }
}

async function handlePresentTravelOptions() {
    logger.group('Orquestrando apresentação de opções de viagem...');
    const narrationStore = useNarrationStore();
    const displayStore = useDisplayStore();
    const runStore = useRunStore();
    
    const travelableScenes = getTravelOptions(runStore.visitedScenesInThisRun);

    if (travelableScenes.length === 0) {
      logger.log("Não há mais destinos. Encerrando a run.");
      logger.groupEnd();
      return handleTransitionToEnding();
    }

    const narrationText = runStore.currentScene.msg_saida || "Para onde agora?";
    await narrationStore.speak([narrationText]);
    
    runStore.travelOptions = travelableScenes;
    displayStore.setInteractionsVisibility(true);
    logger.log('Opções de viagem prontas.', runStore.travelOptions);
    logger.groupEnd();
}

export async function handleTransitionToEnding() {
    logger.group('Orquestrando sequência de fim de run...');
    const playerStore = usePlayerStore();
    const narrationStore = useNarrationStore();
    const displayStore = useDisplayStore();
    const runStore = useRunStore();

    runStore.gamePhase = 'ENDING';
    playerStore.gamePhase = 'ENDING'; // Manter o estado persistente sincronizado
    playerStore.lastSceneName = null; // Limpar a última cena ao terminar
    playerStore.saveProgress();

    displayStore.setInteractionsVisibility(false);
    await displayStore.waitFor(400);
    await displayStore.animateSceneFadeOut();

    const sequence = getEndingSequence(playerStore.runCount);
    if (!sequence) {
      logger.warn(`Nenhuma sequência de fim encontrada para a run ${playerStore.runCount}.`);
      await narrationStore.speak(["A jornada termina aqui."]);
    } else {
      runStore.currentScene = sequence;
      runStore.isFinalEnding = playerStore.isGameComplete;
      await narrationStore.speak(sequence.narration);
    }
    
    displayStore.setInteractionsVisibility(true);
    logger.groupEnd();
}
