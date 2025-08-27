# Sequência de Eventos Completa (V1 - Legado)

# Início de Run
### Fase 1: Inicialização do Jogo/Run
1.  ---
    id: F1-S1
    cat: Gatilho
    ---
    Montagem `App.vue`.
2.  ---
    id: F1-S2
    cat: SISTEMA
    ref: S-PER
    ---
    Carrega progresso `LocalStorage`.
3.  ---
    id: F1-S3
    cat: LÓGICA
    ---
    Chama `useRunStore.startNewGameOrRun()`.
4.  ---
    id: F1-S4
    cat: SISTEMA
    ---
    Verifica conclusão do jogo.
5.  ---
    id: F1-S5
    cat: LÓGICA
    ---
    Incrementa `playerStore.runCount`.
6.  ---
    id: F1-S6
    cat: LÓGICA
    ---
    Busca dados da sequência inicial.
7.  ---
    id: F1-S7
    cat: LÓGICA
    ---
    Atualiza `gamePhase` para `'STARTING'`.

### Fase 2: Apresentação da Cena Inicial
1.  ---
    id: F2-S1
    cat: Gatilho
    ---
    `currentScene` é atualizado.
2.  ---
    id: F2-S2
    cat: ÁUDIO
    dur: 2s
    ---
    Fade-in `ambience_track`. _[META]_
3.  ---
    id: F2-S3
    cat: UI
    dur: 3s
    ---
    Fade-in imagem de fundo.
4.  ---
    id: F2-S4
    cat: UI
    delay: 0.5s
    ---
    Renderiza `DialogueBox`.
5.  ---
    id: F2-S5
    cat: LÓGICA
    ---
    Chama `narrationStore.speak()`.
6.  ---
    id: F2-S6
    cat: UI
    wait: F2-S5
    ---
    Anima texto (typewriter).

### Fase 3: Aguardando Ação do Jogador
1.  ---
    id: F3-S1
    cat: Gatilho
    ---
    Animação do texto termina.
2.  ---
    id: F3-S2
    cat: LÓGICA
    ---
    Busca ações disponíveis.
3.  ---
    id: F3-S3
    cat: UI
    ---
    Fade-in botão de ação.
4.  ---
    id: F3-S4
    cat: LÓGICA
    ---
    Define `presentationState` para `'AWAITING_CHOICE'`.

# Transição de Viagem
### Fase 1: Consequência da Escolha
1.  ---
    id: V-F1-S1
    cat: Gatilho
    ---
    Jogador clica em botão de escolha.
2.  ---
    id: V-F1-S2
    cat: UI
    ---
    Fade-out `DialogueBox`. _[META]_
3.  ---
    id: V-F1-S3
    cat: LÓGICA
    ---
    Processa escolha, desbloqueia `escolhaId`.
4.  ---
    id: V-F1-S4
    cat: SISTEMA
    ref: M-ULK
    ---
    Processa desbloqueios causais.
5.  ---
    id: V-F1-S5
    cat: SISTEMA
    ref: M-ULK
    ---
    Avalia requisitos de desbloqueio.
6.  ---
    id: V-F1-S6
    cat: SISTEMA
    ref: S-PER
    ---
    Salva progresso no `LocalStorage`.
7.  ---
    id: V-F1-S7
    cat: UI
    ---
    Fade-in `DialogueBox` com consequência. _[META]_
8.  ---
    id: V-F1-S8
    cat: ÁUDIO
    ---
    Inicia SFX de descoberta. _[META]_

### Fase 2: Preparação para a Viagem
1.  ---
    id: V-F2-S1
    cat: Gatilho
    ---
    Animação da consequência termina.
2.  ---
    id: V-F2-S2
    cat: UI
    ---
    Fade-out `DialogueBox`. _[META]_
3.  ---
    id: V-F2-S3
    cat: UI
    ---
    Fade-out fundo da cena. _[META]_
4.  ---
    id: V-F2-S4
    cat: ÁUDIO
    ---
    Fade-out música da run. _[META]_

### Fase 3: A Escolha do Destino
1.  ---
    id: V-F3-S1
    cat: Gatilho
    ---
    Animações da Fase 2 terminam.
2.  ---
    id: V-F3-S2
    cat: SISTEMA
    ---
    Sorteia destinos disponíveis.
3.  ---
    id: V-F3-S3
    cat: UI
    ---
    Fade-in botões de viagem. _[META]_
4.  ---
    id: V-F3-S4
    cat: Gatilho
    ---
    Jogador clica em botão de viagem.
5.  ---
    id: V-F3-S5
    cat: UI
    ---
    Fade-out botão não escolhido. _[META]_
6.  ---
    id: V-F3-S6
    cat: UI
    delay: 0.2s
    ---
    Fade-out botão escolhido. _[META]_

### Fase 4: A Chegada
1.  ---
    id: V-F4-S1
    cat: Gatilho
    ---
    Animações da Fase 3 terminam.
2.  ---
    id: V-F4-S2
    cat: ÁUDIO
    ---
    Fade-out som ambiente anterior. _[META]_
3.  ---
    id: V-F4-S3
    cat: LÓGICA
    ---
    Atualiza estado com nova cena.
4.  ---
    id: V-F4-S4
    cat: ÁUDIO
    wait: V-F4-S2
    ---
    Fade-in som ambiente novo. _[META]_
5.  ---
    id: V-F4-S5
    cat: ÁUDIO
    ---
    Fade-in música da run. _[META]_
6.  ---
    id: V-F4-S6
    cat: UI
    ---
    Fade-in fundo da nova cena.
7.  ---
    id: V-F4-S7
    cat: UI
    ---
    Fade-in `DialogueBox` com chegada.

# Fim de Run
### Fase 1: Gatilho de Fim de Run
1.  ---
    id: E-F1-S1
    cat: Gatilho
    ---
    Opções de conteúdo/viagem se esgotam.
2.  ---
    id: E-F1-S2
    cat: LÓGICA
    ---
    Chama `useRunStore.transitionToEnding()`.
3.  ---
    id: E-F1-S3
    cat: LÓGICA
    ---
    Atualiza `gamePhase` para `'ENDING'`.
4.  ---
    id: E-F1-S4
    cat: LÓGICA
    ---
    Busca dados do final da run.

### Fase 2: Transição para a Cena Final
1.  ---
    id: E-F2-S1
    cat: Gatilho
    ---
    `gamePhase` é alterado.
2.  ---
    id: E-F2-S2
    cat: UI
    ---
    Fade-out fundo da cena.
3.  ---
    id: E-F2-S3
    cat: ÁUDIO
    ---
    Fade-out música e ambiente da run. _[META]_
4.  ---
    id: E-F2-S4
    cat: ÁUDIO
    wait: E-F2-S3
    ---
    Fade-in música de finalização. _[META]_

### Fase 3: Apresentação da Narração Final
1.  ---
    id: E-F3-S1
    cat: Gatilho
    ---
    Transições da Fase 2 terminam.
2.  ---
    id: E-F3-S2
    cat: LÓGICA
    ---
    Chama `narrationStore.speak()` com diálogo final.
3.  ---
    id: E-F3-S3
    cat: UI
    ---
    Fade-in `DialogueBox`.
4.  ---
    id: E-F3-S4
    cat: UI
    ---
    Anima texto de narração (typewriter).

### Fase 4: Decisão Pós-Run
1.  ---
    id: E-F4-S1
    cat: Gatilho
    ---
    Animação do texto termina.
2.  ---
    id: E-F4-S2
    cat: LÓGICA
    ---
    Verifica se é o final definitivo.
3.  ---
    id: E-F4-S3
    cat: UI
    ---
    Exibe controle pós-run.
4.  ---
    id: E-F4-S4
    cat: LÓGICA
    ---
    Define `presentationState` para `'AWAITING_CHOICE'`.
