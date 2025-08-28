# Store: useRunStore

- **File Path:** `src/stores/useRunStore.js`
- **Responsibility:** To manage the **ephemeral and volatile** state of the *currently active* game run.

---

## 1. Design Philosophy

**Analogy: The Temporary Workbench.**

This store is the "control panel" for the game's present moment. It is not concerned with the player's overall progress, but with the "right now." Its state is **intentionally volatile** and has a short lifespan.

It is **mandatorily reset (`$reset()`)** by the `runOrchestrator` at the beginning of every new run. This is a critical architectural rule to ensure each run is an isolated session, free from data contamination from the previous one. No persistent data should ever be stored here.

The store's actions also serve as a protective **facade**. UI components call simple actions on this store (e.g., `selectChoice(id)`), which then delegate the complex, asynchronous logic to the `runOrchestrator`. This decouples the UI from the game's core orchestration engine.

---

## 2. Store API

### State Properties

| Property                 | Type            | Default Value              | Description                                                                                             |
| ------------------------ | --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `gamePhase`              | `String`        | `'IDLE'`                   | The current high-level phase of this run (`STARTING`, `EXPLORING`, `ENDING`), primarily used to drive UI modes. |
| `currentScene`           | `Object`        | `null`                     | The complete data object for the currently displayed scene, taken from `cenas.json` or `inicios.json`.  |
| `availableInteractions`  | `Object`        | `{ choices: [], actions: [] }` | The specific choices and actions available to the player *at this moment*.                              |
| `visitedScenesInThisRun` | `Array<String>` | `[]`                       | A temporary list of scene names visited *within this run only*, used to prevent immediate repetition. |
| `travelOptions`          | `Array<String>` | `[]`                       | The list of scene names presented to the player as travel destinations.                               |
| `isFinalEnding`          | `Boolean`       | `false`                    | A flag set during the `ENDING` phase if this is the very last run of the game.                          |

### Getters

-   `backgroundUrl`
    -   Computes the correct asset path for the background image of the `currentScene`. Returns `null` if there is no scene.

### Actions

The actions in this store are simple wrappers that trigger the more complex logic in the `runOrchestrator`, often wrapping them in an input lock for safety.

-   `resumeGameSession()`: Initiates the game logic when the app loads.
-   `startNextRun()`: Begins the next gameplay run.
-   `travelToScene(sceneName)`: Handles the transition to a new scene.
-   `selectChoice(escolhaId)`: Processes a player's content choice.
-   `executeAction(action)`: Processes a player's non-content action (e.g., starting exploration).
