# Service: runOrchestrator

- **File Path:** `src/services/runOrchestrator.js`
- **Responsibility:** To orchestrate the high-level flow of the game, acting as the central process manager.

---

## 1. Design Philosophy

**Analogy: The Game's Maestro or Director.**

The `runOrchestrator` is a **stateless service**. It does not hold any data itself. Its sole purpose is to contain the **process logic** that moves the game from one state to the next.

It operates by:
1.  Reading the current state from the stores (primarily `usePlayerStore` and `useRunStore`).
2.  Calling pure logic functions from `/src/gameLogic/` to make decisions.
3.  Executing a sequence of actions by calling actions on various stores (`useDisplayStore`, `useNarrationStore`, etc.).
4.  Writing the new state back to the stores.

This approach centralizes the complex, asynchronous game flow into a single, understandable location, embodying the **Cognitive Clarity** pillar by transforming what would be tangled `Promise` chains into a set of clearly named, sequential functions.

---

## 2. Core Handlers

These are the main exported functions that drive the game forward. They are typically called from the facade actions in `useRunStore`.

-   `handleResumeGameSession()`
    -   **Trigger:** Called once when `App.vue` is mounted.
    -   **Responsibility:** The main entry point of the game. It checks the persistent state in `usePlayerStore` (`gamePhase`, `lastSceneName`) to determine if it should resume a run in the middle of exploration or start a new run's introductory sequence via the `runStartMachine`.

-   `handleStartNextRun()`
    -   **Trigger:** Called when the player clicks "Begin Next Journey" at the end of a run.
    -   **Responsibility:** To orchestrate the transition between runs. It calls `runStore.$reset()` to clear the temporary workbench, then `playerStore.startNewRun()` to increment the persistent run counter, and finally kicks off the `initializeRunLogic` for the new run.

-   `handleSelectChoice(escolhaId)`
    -   **Trigger:** Called when a player selects a content choice.
    -   **Responsibility:** Manages the entire consequence-and-travel sequence.
        1.  Locks input via `useDisplayStore`.
        2.  Updates `playerStore` with the newly unlocked choice.
        3.  Saves persistent progress.
        4.  Updates `runStore` with run-specific data (e.g., `visitedScenesInThisRun`).
        5.  Calls `useNarrationStore` to speak the consequence message.
        6.  Fades out the scene and calls `handlePresentTravelOptions`.

-   `handleTravelToScene(sceneName)`
    -   **Trigger:** Called when a player selects a travel destination.
    -   **Responsibility:** Manages the visual and state transition between two scenes, including updating the persistent `playerStore.lastSceneName` for session resumption.

-   `handleExecuteAction(action)`
    -   **Trigger:** Called when a player selects a non-content action (e.g., "Explore the library").
    -   **Responsibility:** To process actions from `actions.json`, primarily to transition the `gamePhase` from `STARTING` to `EXPLORING`.

-   `handleTransitionToEnding()`
    -   **Trigger:** Called when there are no more valid travel options.
    -   **Responsibility:** Orchestrates the final sequence of a run, loading the appropriate ending from `finais.json` and displaying the final narration.

-   `initializeRunLogic()`
    -   **Internal Function**
    -   **Responsibility:** To set up and launch the `runStartMachine` (XState), providing it with the necessary actors and actions to run the introduction sequence for a new run.
