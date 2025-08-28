# Store: useDisplayStore

- **File Path:** `src/stores/useDisplayStore.js`
- **Responsibility:** To manage the global state of the User Interface, focusing on visibility, interactivity, and animations.

---

## 1. Design Philosophy

**Analogy: The UI's Central Nervous System.**

This store does not hold game content. Its sole purpose is to answer questions about the *state of the presentation layer*. It acts as a central hub for controlling UI elements that need to be aware of each other, preventing components from having to communicate directly.

A key feature is the `withInputLock` wrapper, which embodies our **Friction Aversion** pillar. It ensures that any asynchronous player action is protected from concurrent inputs, preventing a common class of bugs and making the UI feel robust.

---

## 2. Store API

### State Properties

| Property                 | Type      | Default Value | Description                                                                                    |
| ------------------------ | --------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `isInputLocked`          | `Boolean` | `false`       | When `true`, all primary interaction buttons in the UI should be disabled.                     |
| `isDialogueVisible`      | `Boolean` | `false`       | Controls the visibility of the main `DialogueBox` component.                                   |
| `areInteractionsVisible` | `Boolean` | `false`       | Controls the visibility of the choice and action buttons *within* the `DialogueBox`.           |

### Actions

-   `lockInput()` / `unlockInput()`
    -   Directly set the `isInputLocked` state. Used internally by `withInputLock`.

-   `withInputLock(asyncAction)`
    -   A higher-order function. It locks input, executes the provided asynchronous action, and guarantees that input is unlocked upon completion (or if an error occurs). **This is the standard way to handle all player interactions.**

-   `setDialogueVisibility(visible)` / `setInteractionsVisibility(visible)`
    -   Setters for their corresponding state properties.

-   `animateSceneFadeOut()` / `animateSceneFadeIn()`
    -   Promise-based actions that use the GSAP library to control the main scene transition overlay, ensuring animations can be awaited by the `runOrchestrator`.
