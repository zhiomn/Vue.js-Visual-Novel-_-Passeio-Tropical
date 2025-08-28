# 2.6 Logic Layer Philosophy

To maintain clarity and separation of concerns, the project's logic is divided into two distinct layers: the pure **Business Logic Layer** (`/src/gameLogic`) and the impure **Service Layer** (`/src/services`).

---

### The Business Logic Layer (`/src/gameLogic`)

-   **Analogy:** The Rulebook.
-   **Philosophy:** This layer contains **pure functions**. A pure function is one that:
    1.  Given the same input, will always return the same output.
    2.  Has no side effects (it does not modify any state outside its own scope, call APIs, or interact with stores).
-   **Responsibility:** To answer "What?" questions based on a given state.
    -   *Example:* "Given the player has unlocked these choices, **what** are the available choices for this scene?" (`getAvailableChoices`)
    -   *Example:* "Given the player is on Run 2, **what** is the starting sequence?" (`getStartingSequence`)
-   **Rules:**
    -   Files in this layer **must not** import from `/src/stores` or `/src/services`.
    -   Functions should be easily testable in isolation.

---

### The Service Layer (`/src/services`)

-   **Analogy:** The Maestro or the Game Engine.
-   **Philosophy:** This layer is **impure**. Its functions are aware of the application's state and are responsible for orchestrating changes and side effects.
-   **Responsibility:** To answer "How?" and "When?" questions. It manages the sequence and timing of events.
    -   *Example:* "**How** do we transition to the next scene? First, lock input; then, call the narration store; then, fade the screen; then, update the run store."
-   **Rules:**
    -   Files in this layer **can** import from `/src/stores` and `/src/gameLogic`.
    -   This is the primary layer for managing complex, asynchronous workflows, often by invoking State Machines.

This strict separation ensures that our core game rules are isolated and testable, while the complex, stateful orchestration is centralized in a single, predictable location.
