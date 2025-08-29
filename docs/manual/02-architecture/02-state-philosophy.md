# 2.2 State Philosophy

The state management in "Tropical Versos" is built on Pinia and follows a strict separation of concerns, aligning with our "Cognitive Clarity" and "Future Self" principles.

---
### The Unidirectional Control Flow: UI -> Service -> Store
Our architecture follows a clear, one-way control flow for all player actions:
1.  **UI (`.vue` components):** The UI's only job is to display state and capture user input. When a player interacts (e.g., clicks a button), the component calls a function directly from the **Service Layer**.
2.  **Service (`runOrchestrator.js`):** This is the "brain". It contains the complex, asynchronous logic. It receives the call from the UI, performs game logic, and calls simple, synchronous actions on the stores to mutate the state.
3.  **Store (`Pinia stores`):** The stores are now almost entirely declarative "state containers". Their primary job is to hold the state and provide getters. Their actions are simple, synchronous mutations that are called *by the Service Layer*.

This pattern makes the flow of logic easy to trace and prevents complex logic from polluting our state containers.

---
### `usePlayerStore`: The Permanent Record
- **Analogy:** The player's permanent save file.
- **Lifespan:** Persistent across all runs. Saved to `LocalStorage`.

### `useRunStore`: The Ephemeral Workbench
- **Analogy:** A temporary session's "whiteboard".
- **Lifespan:** Volatile. Reset at the beginning of every new run.
