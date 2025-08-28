# Store: useNarrationStore

- **File Path:** `src/stores/narration.js`
- **Responsibility:** To manage the queuing and playback of all narrative text in the game.

---

## 1. Design Philosophy

**Analogy: The Teleprompter Operator.**

This store's job is to manage a queue of text lines and present them one at a time. It is designed to be controlled by the `runOrchestrator` (which provides the lines to be spoken) and influenced by the player (who signals when to advance).

It implements the crucial "click-to-complete, click-to-advance" logic. The `playerProceed()` action is intelligent: if a line is still animating, it completes the animation; if the line is already complete, it advances to the next line in the queue. This creates an intuitive and non-frustrating user experience.

---

## 2. Store API

### State Properties

| Property              | Type            | Default Value | Description                                                                                           |
| --------------------- | --------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| `lineQueue`           | `Array<String>` | `[]`          | The upcoming lines of text to be displayed.                                                           |
| `currentLine`         | `String`        | `''`          | The single line of text currently being displayed and animated.                                       |
| `isActive`            | `Boolean`       | `false`       | Is the narration system currently active? If `false`, the `DialogueBox` should display nothing.       |
| `awaitingPlayerInput` | `Boolean`       | `false`       | Becomes `true` after a line's animation is complete, indicating the system is waiting for the player to advance. |
| `isCurrentLineComplete`| `Boolean`      | `false`       | A flag that becomes `true` when the typewriter animation for the `currentLine` finishes.              |
| `skipAnimationSignal` | `Number`        | `0`           | A counter that increments to signal to the UI component (`TypewriterButton`) that it should autocomplete its animation. |

### Getters

-   `narrationText`
    -   A simple getter that returns `currentLine` if the store is `isActive`, otherwise `null`. This is the primary property consumed by the `DialogueBox`.

### Actions

-   `speak(lines)`
    -   Receives an array of strings, populates the `lineQueue`, and begins the narration process. Returns a Promise that resolves when the entire sequence is complete.
-   `nextLine()`
    -   Pops the next line from the `lineQueue` and makes it the `currentLine`. If the queue is empty, it resolves the `speak` Promise.
-   `markLineAsComplete()`
    -   Called by the UI component when its typewriter animation finishes. Sets `awaitingPlayerInput` to `true`.
-   `playerProceed()`
    -   The core action called by the UI. Implements the "complete or advance" logic.
