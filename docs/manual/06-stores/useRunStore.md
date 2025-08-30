# Store: useRunStore

- **File Path:** `src/stores/useRunStore.js`
- **Responsibility:** To manage the **ephemeral and volatile** state of the *currently active* game run.

---

## 1. Design Philosophy

**Analogy: The Temporary Workbench.**

This store is the "control panel" for the game's present moment. It is not concerned with the player's overall progress, but with the "right now." Its state is **intentionally volatile** and has a short lifespan.

It is **mandatorily reset (`$reset()`)** by the `runOrchestrator` at the beginning of every new run. This is a critical architectural rule to ensure each run is an isolated session, free from data contamination from the previous one. No persistent data should ever be stored here.

---

## 2. Store API

### State Properties

| Property                 | Type            | Default Value              | Description                                                                                             |
| ------------------------ | --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `gamePhase`              | `String`        | `'IDLE'`                   | The current high-level phase: `STARTING`, `EXPLORING`, `TRAVELING`, `ENDING`. Used to drive UI modes. |
| `currentScene`           | `Object`        | `null`                     | The complete data object for the currently displayed scene, taken from `cenas.json` or `inicios.json`.  |
| `availableInteractions`  | `Object`        | `{ choices: [], actions: [] }` | The specific choices and actions available to the player *at this moment*.                              |
| `visitedScenesInThisRun` | `Array<String>` | `[]`                       | A temporary list of scene names visited *within this run only*, used to prevent immediate repetition. |
| `travelOptions`          | `Array<String>` | `[]`                       | The list of scene names presented to the player during the `TRAVELING` phase.                               |
| `isFinalEnding`          | `Boolean`       | `false`                    | A flag set during the `ENDING` phase if this is the very last run of the game.                          |

### Getters

-   `backgroundUrl`
    -   Computes the correct asset path for the background image of the `currentScene`. Returns `null` if there is no scene.

### Actions

The actions in this store are simple, synchronous mutations. They are intended to be called by the `runOrchestrator` service, not directly from UI components.

-   `setGamePhase(phase)`: Sets the current game phase.
-   `setCurrentScene(sceneData)`: Sets the data for the active scene.
-   `setInteractions(interactions)`: Sets the choices and actions available to the player.
-   `setTravelOptions(options)`: Sets the available travel destinations.
-   `addVisitedScene(sceneName)`: Adds a scene to the list of visited scenes for the current run.
