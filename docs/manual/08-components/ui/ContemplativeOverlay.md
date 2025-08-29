# Component: ContemplativeOverlay

- **File Path:** `src/components/ui/ContemplativeOverlay.vue`
- **Responsibility:** To render the full-screen, cinematic UI for the `STARTING` and `ENDING` game phases.

---
## 1. Design Philosophy
This component provides an immersive, narrative-focused experience. It always renders the `Stars.vue` component in the background and centers the narration and interaction buttons. It is a purpose-built component that only handles the logic and layout for the game's contemplative modes, making it simple and robust.

---
## 2. Component API
### Props
| Prop | Type | Description |
|---|---|---|
| `narration` | `String` | The narrative text to display. |
| `interactions` | `Object` | The available actions for the player. |
| `gamePhase` | `String` | The current game phase, used to differentiate `ENDING` logic. |
| `isFinalEnding` | `Boolean` | Flag to show the final "The End" text. |
| `areInteractionsVisible`| `Boolean` | Controls the visibility of the action buttons. |
