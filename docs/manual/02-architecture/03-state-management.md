# 2.3 State Management Strategy

The state management in "Tropical Versos" is built on Pinia and follows a strict separation of concerns, aligning with our "Cognitive Clarity" and "Future Self" principles. The two primary stores, `usePlayerStore` and `useRunStore`, have distinct and non-overlapping responsibilities.

---

### `usePlayerStore`: The Permanent Record

-   **Analogy:** The player's permanent save file or memory.
-   **Lifespan:** Persistent. Its data is loaded from `LocalStorage` at the start of the game and saved after every significant progression event. It is never reset unless the player explicitly starts a new game.
-   **Core Responsibilities:**
    -   `runCount`: Tracks which of the three main playthroughs the player is on.
    -   `unlockedEscolhaIds`: A master list of every unique content choice the player has *ever* made. This is the primary driver of all progression in the game.
    -   `activatedApps`: A list of apps the player has manually unlocked via the Terminal.
    -   `hasArchitectAwakened`: A boolean flag for the final, event-based unlock.
-   **Role:** To hold the cumulative, long-term state of the player's entire journey.

---

### `useRunStore`: The Ephemeral Workbench

-   **Analogy:** A temporary control panel or a session's "whiteboard".
-   **Lifespan:** Volatile and temporary. Its state is valid only for the duration of a single run. It is **mandatorily reset (`$reset()`)** by the `runOrchestrator` at the beginning of every new run.
-   **Core Responsibilities:**
    -   `gamePhase`: The current high-level phase of the run (`STARTING`, `EXPLORING`, `ENDING`), used to control UI modes.
    -   `currentScene`: The data for the scene currently being displayed.
    -   `availableInteractions`: The specific choices and actions available to the player *right now*.
    -   `visitedScenesInThisRun`: A temporary list to prevent visiting the same scene twice within a single run.
-   **Role:** To manage the immediate, moment-to-moment state of the active gameplay session and communicate it to the UI layer.

---

### Data Flow

The flow is unidirectional and strictly controlled by the `runOrchestrator`:

1.  **Player Action** (e.g., clicks a choice button in a Vue component).
2.  The UI calls a method on `useRunStore` (e.g., `runStore.selectChoice()`).
3.  The `useRunStore` action immediately invokes the `runOrchestrator`.
4.  The `runOrchestrator` executes the core logic, which may involve:
    -   Writing to `usePlayerStore` to save permanent progress.
    -   Writing to `useRunStore` to update the current scene or game phase.
    -   Calling `useNarrationStore` to display text.
5.  The UI, being reactive, automatically updates based on the new state in the stores.
