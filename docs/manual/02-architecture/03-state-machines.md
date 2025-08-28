# 2.4 State Machines (XState)

In line with our **Cognitive Clarity** pillar, XState is employed to manage complex, multi-step, and asynchronous processes. It transforms implicit flows, often hidden in `async/await` chains and `setTimeout` calls, into explicit, robust, and visualizable state machines.

---

### Why XState?

-   **Clarity:** A state machine's configuration explicitly declares all possible states, the events that cause transitions between them, and the actions executed upon entry or exit. This makes the logic flow self-documenting.
-   **Robustness:** It prevents illegal states. An action cannot be performed unless the machine is in a state that explicitly allows it, eliminating a whole class of bugs related to timing and race conditions.
-   **Maintainability:** Modifying or extending a flow becomes a matter of adding a new state or transition, rather than untangling a complex web of promises and callbacks.

---

### Primary Implementation: `runStartMachine.js`

The most critical use of XState in the project is the `runStartMachine`, which orchestrates the entire sequence of starting a new run.

**The Flow:**

1.  **`initializing`**: The machine starts here. It invokes an "actor" (`loadInitialDataActor`) to asynchronously fetch the run's starting data from `inicios.json`.
    -   On success, it transitions to `presentingScene`.
    -   On failure (e.g., no more runs), it transitions to a final `gameComplete` state.
2.  **`presentingScene`**: On entering this state, it executes actions to fade in the scene's visuals and show the dialogue box. It then waits for a `SCENE_READY` event from the `runOrchestrator` (which is sent after the fade-in animation completes).
3.  **`narrating`**: Upon receiving `SCENE_READY`, it transitions here and invokes another actor (`speakSequenceActor`) to handle the asynchronous typewriter effect for the introductory narration.
4.  **`awaitingAction`**: Once narration is complete, it transitions here. It executes actions to load the available starting choices and displays the interaction buttons to the player. It then waits for the player to click a button, which sends an `ACTION_EXECUTED` event.
5.  **`runStarted`**: Upon receiving the event, it transitions to its final state, signaling to the `runOrchestrator` that the startup sequence is complete and the main exploration loop can begin.

By using XState, this entire critical sequence is contained within a single, predictable, and easily debuggable module.
