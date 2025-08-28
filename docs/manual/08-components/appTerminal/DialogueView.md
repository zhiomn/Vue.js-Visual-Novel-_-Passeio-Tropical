# Component: DialogueView

- **File Path:** `src/components/appTerminal/DialogueView.vue`
- **Responsibility:** To display a typewriter-style dialogue sequence between the player and an AI.

---

## 1. Design Philosophy

This component is responsible for the interactive dialogue system of the Terminal. It receives an AI object, iterates through its `dialogue` array, and displays each line with a typewriter effect using the `TerminalText` child component.

It manages the flow of the conversation, waiting for one line to complete before allowing the player to advance to the next. After the dialogue, it handles the confirmation prompt (if any) and emits events to its parent (`TerminalApp`) to signal completion or the player's choice to open the newly unlocked app.

---

## 2. Component API

### Props

| Prop             | Type      | Default | Description                                                               |
| ---------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `ai`             | `Object`  | `null`  | The full data object for the AI whose dialogue is being displayed.        |
| `isReviewMode`   | `Boolean` | `false` | If `true`, the component displays the entire dialogue instantly without animation, for re-reading. |

### Emitted Events

-   `@dialogue-complete (appToUnlock)`
    -   **Trigger:** The dialogue sequence finishes.
    -   **Payload:** The ID of the app that this dialogue unlocks.
-   `@open-app-confirmed (appToUnlock)`
    -   **Trigger:** The user confirms they want to open the new app from the prompt.
    -   **Payload:** The ID of the app to open.
