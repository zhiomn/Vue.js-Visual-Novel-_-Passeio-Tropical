# Component: DialogueBox

- **File Path:** `src/components/ui/DialogueBox.vue`
- **Responsibility:** To render the primary narration and interaction interface of the game.

---

## 1. Design Philosophy

The `DialogueBox` is the main vehicle for the game's narrative. Its design changes drastically based on the `gamePhase` to reflect the player's "mode":

-   **Standard Mode (`EXPLORING`):** A semi-transparent box at the bottom of the screen, focused on presenting clear, legible choices.
-   **Contemplative Mode (`STARTING`, `ENDING`):** The box becomes invisible, and the text and buttons float in the center of the screen, creating a more cinematic, narrative-focused experience.

---

## 2. Component API

### Props (Input Properties)

| Prop                 | Type      | Default                              | Description                                                                                             |
| -------------------- | --------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `narration`          | `String`  | `''`                                 | The current narrative text to be displayed by the child component `TypewriterButton`.                   |
| `interactions`       | `Object`  | `{ choices: [], actions: [] }`       | An object containing the arrays of content choices and actions (buttons) available to the player.     |
| `travelOptions`      | `Array`   | `[]`                                 | An array of scene name strings, used to render the travel buttons.                                    |
| `gamePhase`          | `String`  | `'IDLE'`                             | The current game phase, which controls the switch between Standard and Contemplative mode.            |
| `isFinalEnding`      | `Boolean` | `false`                              | A flag that, in Contemplative mode, determines whether the "Next Journey" button or "The End" text is shown. |
| `areInteractionsVisible` | `Boolean` | `false`                          | Controls whether the choice/action buttons are rendered.                                              |

### Emitted Events

-   `@choiceSelected (choiceId)`
    -   **Trigger:** The player clicks on a content choice button.
    -   **Payload:** The `id` of the selected choice.

-   `@actionExecuted (actionObject)`
    -   **Trigger:** The player clicks on an action button (in Contemplative mode).
    -   **Payload:** The complete action object from `actions.json`.

-   `@travelSelected (sceneName)`
    -   **Trigger:** The player clicks on a travel button.
    -   **Payload:** The name of the destination scene.

-   `@startNewRun`
    -   **Trigger:** The player clicks the "Begin Next Journey" button at the end of a run.
    -   **Payload:** None.

---

## 3. Store Dependencies

-   **`useNarrationStore`:** Used to trigger the advancement of narration (`playerProceed`) when the box itself is clicked.
-   **`useDisplayStore`:** Used to check if user input is locked (`isInputLocked`) in order to disable the buttons.
