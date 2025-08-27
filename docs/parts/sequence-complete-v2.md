# Sequência de Eventos Completa (V2)

---
# Início de Run
### Fase 1: Gatilho e Inicialização da Máquina de Estado

1.  ---
    id: F1-S1
    cat: Gatilho
    ---
    Montagem do `App.vue` aciona `runStore.startNewGameOrRun()`.

2.  ---
    id: F1-S2
    cat: LÓGICA
    ref: runOrchestrator.js
    ---
    `handleStartNewGameOrRun` incrementa `runCount` e inicia o ator da `runStartMachine`.

3.  ---
    id: F1-S3
    cat: LÓGICA
    wait: F1-S2
    ---
    **[XState: initializing]** A máquina invoca `loadInitialDataActor` para buscar a sequência de início.

4.  ---
    id: F1-S4
    cat: LÓGICA
    ---
    **[XState: transition]** Ao concluir, a máquina transita para `presentingScene`.

### Fase 2: Apresentação da Cena e Narração

1.  ---
    id: F2-S1
    cat: UI
    dur: 3s
    ---
    **[XState: presentingScene]** Ação `fadeInScene` é executada.

2.  ---
    id: F2-S2
    cat: GATILHO
    wait: F2-S1
    ---
    O orquestrador envia o evento `SCENE_READY` para a máquina.

3.  ---
    id: F2-S3
    cat: LÓGICA
    ---
    **[XState: narrating]** A máquina invoca `speakSequenceActor` para iniciar a narração.

4.  ---
    id: F2-S4
    cat: LÓGICA
    ---
    **[XState: transition]** Ao concluir a narração, a máquina transita para `awaitingAction`.

### Fase 3: Aguardando Ação e Transição para Exploração

1.  ---
    id: F3-S1
    cat: UI
    ---
    **[XState: awaitingAction]** A ação `showInteractions` exibe o botão de ação inicial.

2.  ---
    id: F3-S2
    cat: Gatilho
    ---
    Jogador clica no botão de ação (ex: "Explorar a biblioteca").

3.  ---
    id: F3-S3
    cat: LÓGICA
    ref: runOrchestrator.js
    ---
    `handleExecuteAction` envia o evento `ACTION_EXECUTED` para a máquina.

4.  ---
    id: F3-S4
    cat: LÓGICA
    ---
    **[XState: runStarted]** A máquina atinge seu estado final.

5.  ---
    id: F3-S5
    cat: LÓGICA
    wait: F3-S4
    ---
    O orquestrador detecta o fim da máquina e chama `handleTransitionToExploration`.

---
# Transição de Viagem
### Fase 1: Consequência da Escolha

1.  ---
    id: V-F1-S1
    cat: Gatilho
    ---
    Jogador clica em botão de escolha de conteúdo.

2.  ---
    id: V-F1-S2
    cat: LÓGICA
    ref: runOrchestrator.js
    ---
    `handleSelectChoice` é chamado. Ele processa a escolha e salva o progresso.

3.  ---
    id: V-F1-S3
    cat: SISTEMA
    ref: M-ULK
    ---
    Sistemas de desbloqueio causal e de requisitos são avaliados.

4.  ---
    id: V-F1-S4
    cat: UI
    ---
    `DialogueBox` exibe a mensagem de consequência (`msg_antes`).

### Fase 2: Apresentação das Opções de Viagem

1.  ---
    id: V-F2-S1
    cat: Gatilho
    ---
    Narração da consequência termina.

2.  ---
    id: V-F2-S2
    cat: LÓGICA
    ref: runOrchestrator.js
    ---
    `handlePresentTravelOptions` é chamado.

3.  ---
    id: V-F2-S3
    cat: LÓGICA
    ---
    Verifica se ainda há destinos ou escolhas disponíveis. Se não, transita para o Fim.

4.  ---
    id: V-F2-S4
    cat: UI
    ---
    Exibe a narração de saída (`msg_saida`) e os botões de viagem.

### Fase 3: Execução da Viagem

1.  ---
    id: V-F3-S1
    cat: Gatilho
    ---
    Jogador clica em um botão de destino.
2.  ---
    id: V-F3-S2
    cat: LÓGICA
    ref: runOrchestrator.js
    ---
    `handleTravelToScene` é chamado com o nome do novo destino.
3.  ---
    id: V-F3-S3
    cat: UI
    dur: 700ms
    ---
    Fade-out da cena atual.
4.  ---
    id: V-F3-S4
    cat: LÓGICA
    ---
    O estado da `runStore` é atualizado com os dados da nova cena.
5.  ---
    id: V-F3-S5
    cat: UI
    dur: 700ms
    wait: V-F3-S3
    ---
    Fade-in da nova cena e da sua narração de chegada. O ciclo retorna para a Fase 1.

---
# Fim de Run
### Fase 1: Gatilho de Fim de Run

1.  ---
    id: E-F1-S1
    cat: Gatilho
    ---
    `handlePresentTravelOptions` não encontra mais destinos ou escolhas válidas.

2.  ---
    id: E-F1-S2
    cat: LÓGICA
    ref: runOrchestrator.js
    ---
    O orquestrador chama `handleTransitionToEnding()`.

3.  ---
    id: E-F1-S3
    cat: LÓGICA
    ---
    `runStore.gamePhase` é atualizado para `'ENDING'`.

### Fase 2: Transição e Narração Final

1.  ---
    id: E-F2-S1
    cat: UI
    ---
    Fade-out da cena final da run.

2.  ---
    id: E-F2-S2
    cat: LÓGICA
    wait: E-F2-S1
    ---
    Busca os dados da sequência de final em `finais.json`.

3.  ---
    id: E-F2-S3
    cat: UI
    ---
    `DialogueBox` exibe a narração final da run.

### Fase 3: Decisão Pós-Run

1.  ---
    id: E-F3-S1
    cat: Gatilho
    ---
    Narração final termina.

2.  ---
    id: E-F3-S2
    cat: UI
    ---
    O botão "Começar a Próxima Jornada" ou o texto "Fim" é exibido.

3.  ---
    id: E-F3-S3
    cat: LÓGICA
    ---
    O jogo aguarda o input do jogador para iniciar a próxima run.
