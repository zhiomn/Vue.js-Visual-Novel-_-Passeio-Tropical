# 2.4 The Lifecycle of a Player Action

This document details the step-by-step flow of data and function calls that occur from a single user interaction. It connects all the major parts of our architecture (UI, Stores, Services) into a unified sequence.

**Example Scenario:** The player is in the `EXPLORING` phase and clicks on a content choice button in the `DialogueBox`.

---

1.  **Trigger (UI Layer)**
    -   **Location:** `DialogueBox.vue`
    -   **Action:** The `@click` event on the button is triggered.

2.  **Store Facade Call (Store Layer)**
    -   **Location:** `DialogueBox.vue` -> `useRunStore.js`
    -   **Action:** The component calls the simple facade action on the run store: `runStore.selectChoice(choiceId)`.

3.  **Input Lock (Display Store)**
    -   **Location:** `useRunStore.js` -> `useDisplayStore.js`
    -   **Action:** The `selectChoice` action immediately wraps its logic in `displayStore.withInputLock()`. This sets `isInputLocked` to `true`, instantly disabling all interactive buttons in the UI to prevent concurrent actions.

4.  **Orchestration (Service Layer)**
    -   **Location:** `useRunStore.js` -> `runOrchestrator.js`
    -   **Action:** The store action delegates the complex work to the orchestrator by calling `handleSelectChoice(choiceId)`.

5.  **Business Logic & State Updates (Service -> Stores)**
    -   **Location:** `runOrchestrator.js`
    -   **Action:** The `handleSelectChoice` function executes the core game logic in sequence:
        1.  Calls `playerStore.unlockChoice(choiceId)` to update the persistent player progress.
        2.  Calls `playerStore.saveProgress()` to save to `LocalStorage`.
        3.  Updates the temporary `runStore.visitedScenesInThisRun`.
        4.  Calls `narrationStore.speak()` with the consequence message, which returns a promise.
        5.  `await`s the narration to complete.

6.  **Further Orchestration (Service -> Service)**
    -   **Location:** `runOrchestrator.js`
    -   **Action:** After the narration is complete, `handleSelectChoice` continues its sequence:
        1.  Calls `displayStore.animateSceneFadeOut()`.
        2.  `await`s the fade animation.
        3.  Calls the next orchestrator function, `handlePresentTravelOptions()`.

7.  **Reactivity (Store -> UI Layer)**
    -   **Location:** `useRunStore.js` -> `DialogueBox.vue`
    -   **Action:** The `handlePresentTravelOptions` function updates `runStore.travelOptions` with new destinations. Because the UI is reactive, the `DialogueBox` component automatically detects this change and renders the new travel buttons.

8.  **Input Unlock (Display Store)**
    -   **Location:** `useDisplayStore.js`
    -   **Action:** The `withInputLock` wrapper automatically sets `isInputLocked` back to `false` now that the entire asynchronous sequence is complete. The UI buttons become interactive again.
