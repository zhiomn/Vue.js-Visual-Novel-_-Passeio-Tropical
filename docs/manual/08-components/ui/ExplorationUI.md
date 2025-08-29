# Component: ExplorationUI

- **File Path:** `src/components/ui/ExplorationUI.vue`
- **Responsibility:** To render the primary UI for the `EXPLORING` game phase.

---
## 1. Design Philosophy
This component is the classic "dialogue box" UI for the main game loop. It is rendered at the bottom of the screen and is responsible for displaying scene narration and the player's choices (both content choices and travel options). It is a purpose-built component that contains no logic for other game phases.

---
## 2. Component API
### Props
| Prop | Type | Description |
|---|---|---|
| `narration` | `String` | The narrative text to display. |
| `interactions` | `Object` | The available content choices for the player. |
| `travelOptions` | `Array` | The available travel destinations. |
| `areInteractionsVisible`| `Boolean` | Controls the visibility of the choice/travel buttons. |
