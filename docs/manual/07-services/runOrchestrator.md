# Service: runOrchestrator

- **File Path:** `src/services/runOrchestrator.js`
- **Responsibility:** To orchestrate the high-level flow of the game, acting as the central process manager called directly by the UI.

---
## 1. Design Philosophy
**Analogy: The Game's Maestro or Director.**

The `runOrchestrator` is a **stateless service** that contains the **process logic** that moves the game from one state to the next. It is the implementation of our unidirectional control flow: **UI components call functions in this service directly.**

The orchestrator then executes the required game logic, often invoking **XState machines** for complex, multi-step asynchronous flows (like starting a run or handling a travel sequence). Finally, it commits state changes by calling simple, synchronous actions on the Pinia stores.

---
## 2. Core Handlers
-   `resumeGameSession()`: The main entry point of the game, called by `App.vue`.
-   `selectChoice(escolhaId)`: The entry point for the travel sequence. It is responsible for unlocking the choice and then invoking the `travelMachine`.
-   `travelToScene(sceneName)`: Handles the direct transition to a new scene.
-   `executeAction(action)`: Processes non-content actions, primarily the transition from `STARTING` to `EXPLORING`.
-   `startNextRun()`: Handles the logic for ending one run and starting the next.
