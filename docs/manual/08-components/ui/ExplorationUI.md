# Component: ExplorationUI

- **File Path:** `src/components/ui/ExplorationUI.vue`
- **Responsibility:** To render the primary UI for the `EXPLORING` game phase.

---
## 1. Design Philosophy
This component is the classic "dialogue box" UI for the main game loop. It is rendered at the bottom of the screen and is responsible for displaying scene narration and the player's content choices. It is a purpose-built component that contains no logic for other game phases.

**Note:** This component is no longer responsible for displaying travel options, which have been moved to the dedicated `TravelOverlay.vue` component to create a distinct "Travel Mode".

---
## 2. Component API
### Props
| Prop | Type | Description |
|---|---|---|
| `narration` | `String` | The narrative text to display. |
| `interactions` | `Object` | The available content choices for the player. |
| `areInteractionsVisible`| `Boolean` | Controls the visibility of the choice buttons. |
