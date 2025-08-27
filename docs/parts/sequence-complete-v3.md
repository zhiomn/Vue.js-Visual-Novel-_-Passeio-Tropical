# Sequência de Eventos Completa (V3 - Roteiro de Polimento)

# Início de Run
### Fase 1: Gatilho e Inicialização da Máquina de Estado
1.  ---
    id: INIT_TRIGGER_APP_MOUNT
    actionId: TRIGGER_APP_MOUNT
    ---
2.  ---
    id: INIT_LOGIC_CALL_START_RUN
    actionId: LOGIC_CALL_START_RUN
    ref: runOrchestrator.js
    ---
3.  ---
    id: INIT_LOGIC_XSTATE_INIT
    actionId: LOGIC_XSTATE_INIT
    wait: INIT_LOGIC_CALL_START_RUN
    ---
4.  ---
    id: INIT_LOGIC_XSTATE_TRANSITION_TO_PRESENTING
    actionId: LOGIC_XSTATE_TRANSITION
    ---
    `{{targetState}}`: `presentingScene`

### Fase 2: Apresentação da Cena e Narração
1.  ---
    id: INIT_UI_FADE_IN_SCENE
    actionId: UI_FADE_IN_SCENE
    dur: 700ms
    ---
2.  ---
    id: INIT_TRIGGER_SCENE_READY
    actionId: TRIGGER_SCENE_READY
    wait: INIT_UI_FADE_IN_SCENE
    ---
3.  ---
    id: INIT_LOGIC_XSTATE_NARRATE
    actionId: LOGIC_XSTATE_NARRATE
    ---
4.  ---
    id: INIT_UI_TYPEWRITER
    actionId: UI_SHOW_FINAL_NARRATION
    wait: INIT_LOGIC_XSTATE_NARRATE
    ---
    _[META]_

### Fase 3: Aguardando Ação e Transição para Exploração
1.  ---
    id: INIT_UI_SHOW_INTERACTIONS
    actionId: UI_SHOW_INTERACTIONS
    ---
2.  ---
    id: INIT_TRIGGER_PLAYER_ACTION_CLICK
    actionId: TRIGGER_PLAYER_ACTION_CLICK
    ---
3.  ---
    id: INIT_LOGIC_SEND_EVENT_TO_XSTATE
    actionId: LOGIC_ORCHESTRATOR_CALL
    ref: runOrchestrator.js
    ---
    `{{method}}`: `handleExecuteAction`
4.  ---
    id: INIT_LOGIC_XSTATE_FINAL
    actionId: LOGIC_XSTATE_FINAL
    ---
    `{{state}}`: `runStarted`
5.  ---
    id: INIT_LOGIC_TRANSITION_TO_EXPLORE
    actionId: LOGIC_ORCHESTRATOR_CALL
    wait: INIT_LOGIC_XSTATE_FINAL
    ---
    `{{method}}`: `handleTransitionToExploration`

# Transição de Viagem
### Fase 1: Consequência da Escolha
1.  ---
    id: TRAVEL_TRIGGER_PLAYER_CHOICE_CLICK
    actionId: TRIGGER_PLAYER_CHOICE_CLICK
    ---
2.  ---
    id: TRAVEL_UI_FADE_OUT_BUTTONS
    actionId: UI_FADE_OUT_BUTTONS
    dur: 400ms
    ---
3.  ---
    id: TRAVEL_LOGIC_SELECT_CHOICE
    actionId: LOGIC_SELECT_CHOICE
    wait: TRAVEL_UI_FADE_OUT_BUTTONS
    ref: runOrchestrator.js
    ---
4.  ---
    id: TRAVEL_UI_SHOW_CONSEQUENCE
    actionId: UI_SHOW_CONSEQUENCE
    ---
5.  ---
    id: TRAVEL_AUDIO_PLAY_SFX_DISCOVERY
    actionId: AUDIO_PLAY_SFX_DISCOVERY
    ---
    _[META]_

### Fase 2: Apresentação das Opções de Viagem
1.  ---
    id: TRAVEL_TRIGGER_NARRATION_COMPLETE
    actionId: TRIGGER_NARRATION_COMPLETE
    ---
2.  ---
    id: TRAVEL_LOGIC_PRESENT_OPTIONS
    actionId: LOGIC_ORCHESTRATOR_CALL
    ref: runOrchestrator.js
    ---
    `{{method}}`: `handlePresentTravelOptions`
3.  ---
    id: TRAVEL_UI_SHOW_TRAVEL
    actionId: UI_SHOW_TRAVEL
    ---

### Fase 3: Execução da Viagem
1.  ---
    id: TRAVEL_TRIGGER_PLAYER_TRAVEL_CLICK
    actionId: TRIGGER_PLAYER_TRAVEL_CLICK
    ---
2.  ---
    id: TRAVEL_LOGIC_CALL_TRAVEL
    actionId: LOGIC_ORCHESTRATOR_CALL
    ref: runOrchestrator.js
    ---
    `{{method}}`: `handleTravelToScene`
3.  ---
    id: TRAVEL_UI_FADE_OUT_SCENE
    actionId: UI_FADE_OUT_SCENE
    dur: 700ms
    ---
4.  ---
    id: TRAVEL_LOGIC_UPDATE_STATE
    actionId: LOGIC_UPDATE_STATE
    ---
5.  ---
    id: TRAVEL_UI_FADE_IN_NEW_SCENE
    actionId: UI_FADE_IN_NEW_SCENE
    dur: 700ms
    wait: TRAVEL_UI_FADE_OUT_SCENE
    ---

# Fim de Run
### Fase 1: Gatilho de Fim de Run
1.  ---
    id: END_TRIGGER_NO_MORE_OPTIONS
    actionId: TRIGGER_NO_MORE_OPTIONS
    ---
2.  ---
    id: END_LOGIC_CALL_ENDING
    actionId: LOGIC_ORCHESTRATOR_CALL
    ref: runOrchestrator.js
    ---
    `{{method}}`: `handleTransitionToEnding()`

### Fase 2: Transição e Narração Final
1.  ---
    id: END_UI_FADE_OUT_SCENE
    actionId: UI_FADE_OUT_SCENE
    dur: 700ms
    ---
2.  ---
    id: END_AUDIO_FADE_OUT
    actionId: AUDIO_PLAY_SFX_DISCOVERY
    ---
    _[META]_
3.  ---
    id: END_AUDIO_FADE_IN
    actionId: AUDIO_PLAY_SFX_DISCOVERY
    wait: END_AUDIO_FADE_OUT
    ---
    _[META]_
4.  ---
    id: END_LOGIC_FETCH_DATA
    actionId: LOGIC_FETCH_DATA
    wait: END_UI_FADE_OUT_SCENE
    ---
5.  ---
    id: END_UI_SHOW_FINAL_NARRATION
    actionId: UI_SHOW_FINAL_NARRATION
    ---

### Fase 3: Decisão Pós-Run
1.  ---
    id: END_TRIGGER_NARRATION_COMPLETE
    actionId: TRIGGER_NARRATION_COMPLETE
    ---
2.  ---
    id: END_UI_SHOW_POST_RUN
    actionId: UI_SHOW_POST_RUN
    ---
