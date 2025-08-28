# Store: usePlayerStore

- **File Path:** `src/stores/player.js`
- **Responsibility:** To manage all persistent, long-term player progress that survives across multiple runs and browser sessions.

---

## 1. Design Philosophy

**Analogy: The Permanent Save Game.**

This store represents the player's complete journey and memory. Its state is designed to be **persistent**. It is loaded from `LocalStorage` when the game starts and is saved back after every significant progression event.

Its data should **never be reset** during normal gameplay. It only grows and accumulates. The only exception is the developer-facing `resetGame()` action, which is used for testing purposes.

---

## 2. Store API

### State Properties

| Property               | Type            | Default Value | Description                                                                                             |
| ---------------------- | --------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `isReady`              | `Boolean`       | `false`       | A flag that becomes `true` only after progress has been loaded, allowing the main `App.vue` to render.      |
| `runCount`             | `Number`        | `0`           | The number of the current run (1, 2, or 3). Incremented at the start of a new run.                      |
| `unlockedEscolhaIds`   | `Array<Number>` | `[]`          | The master list of all unique choice IDs the player has ever selected. **This is the primary driver of all game progression.** |
| `gamePhase`            | `String`        | `'IDLE'`      | The high-level state of the current run (`STARTING`, `EXPLORING`, `ENDING`). Persisted to allow for session resumption. |
| `lastSceneName`        | `String`        | `null`        | The name of the last visited scene. Used to resume the game in the correct location after a page refresh.  |
| `activatedApps`        | `Array<String>` | `[]`          | A list of app IDs that have been manually unlocked via the Terminal.                                    |
| `hasArchitectAwakened` | `Boolean`       | `false`       | A global flag set by a specific in-game event, used to trigger the final app unlock.                    |

### Getters

-   `isGameComplete`
    -   Returns `true` if `runCount` is greater than the `totalRuns` defined in `config.json`. Signals the end of the entire game.
-   `unlockedChoiceCount`
    -   Returns the `length` of the `unlockedEscolhaIds` array. This number is the key metric used by `requirements.json` to unlock apps and content.

### Actions

-   `unlockChoice(escolhaId)`
    -   Adds a unique choice ID to the `unlockedEscolhaIds` array. Prevents duplicates.
-   `startNewRun()`
    -   Increments the `runCount` and resets run-specific progress state (`gamePhase`, `lastSceneName`).
-   `addActivatedApp(appId)`
    -   Adds a unique app ID to the `activatedApps` array.
-   `awakenArchitect()`
    -   Sets the `hasArchitectAwakened` flag to `true`.
-   `saveProgress()`
    -   Serializes the entire state of this store and saves it to `LocalStorage`.
-   `loadProgress()`
    -   Loads and patches the store's state from `LocalStorage` if a save file exists.
-   `resetGame()`
    -   **[Dev Tool]** Clears `LocalStorage` and resets the store to its initial state, forcing a page reload.
