# 2.4 The Lifecycle of a Player Action

This document details the step-by-step flow of calls that occur from a single user interaction, following our refined unidirectional control flow.

**Example Scenario:** The player clicks a content choice button in `ExplorationUI.vue`.

---

1.  **Trigger (UI Layer)**
    -   **Location:** `ExplorationUI.vue`
    -   **Action:** The `@click` event calls the `selectChoice(choiceId)` method, which is imported directly from the orchestrator.

2.  **Orchestration (Service Layer)**
    -   **Location:** `runOrchestrator.js`
    -   **Action:** The `selectChoice` function is executed. Its first step is to wrap the entire operation in `displayStore.withInputLock()` to prevent concurrent actions.

3.  **State Mutation (Service -> Store Layer)**
    -   **Location:** `runOrchestrator.js` -> `usePlayerStore.js`
    -   **Action:** The orchestrator calls `playerStore.unlockChoice(choiceId)` to update the persistent state.

4.  **Flow Control (Service Layer)**
    -   **Location:** `runOrchestrator.js`
    -   **Action:** The orchestrator now invokes the `travelMachine` actor, which takes over the multi-step process of showing the consequence, fading the scene, and presenting travel options.

5.  **State Updates & Side Effects (Service -> Stores)**
    -   **Location:** `runOrchestrator.js` (via the `travelMachine`'s actions)
    -   **Action:** As the machine runs, it calls simple actions on the stores, such as `narrationStore.speak()` and `runStore.setTravelOptions()`.

6.  **Reactivity (Store -> UI Layer)**
    -   **Location:** `useRunStore.js` -> `ExplorationUI.vue`
    -   **Action:** The UI components, which are reactively watching the stores, automatically update to display the new state (e.g., showing the new travel options).

7.  **Input Unlock (Service -> Store)**
    -   **Location:** `runOrchestrator.js` -> `useDisplayStore.js`
    -   **Action:** The `withInputLock` wrapper automatically sets `isInputLocked` back to `false` once the entire asynchronous sequence is complete.
