# Component: TerminalView

- **File Path:** `src/components/appTerminal/TerminalView.vue`
- **Responsibility:** To display the list of available AI entities that can be contacted.

---

## 1. Design Philosophy

This is a presentational component that renders a list of "buttons" based on the data in `ais.json`. It has a distinct, text-based UI to match the terminal aesthetic.

Its primary logical responsibility is to determine the state of each button (enabled, disabled, or "activated") based on the player's progress. It reads from the `phoneStore.getAppState` getter to check if an AI's requirements have been met and if the app it unlocks has already been activated.

---

## 2. Component API

### Props

| Prop  | Type    | Default | Description                                   |
| ----- | ------- | ------- | --------------------------------------------- |
| `ais` | `Array` | `[]`    | The array of AI objects from `ais.json`.      |

### Emitted Events

-   `@contact-ai (aiId)`
    -   **Trigger:** User clicks on an enabled AI button.
    -   **Payload:** The `id` of the selected AI.
