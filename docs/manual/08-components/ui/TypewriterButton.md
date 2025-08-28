# Component: TypewriterButton

- **File Path:** `src/components/ui/TypewriterButton.vue`
- **Responsibility:** To render the main narrative text with a typewriter effect inside the `DialogueBox`.

---

## 1. Design Philosophy

This component is the primary engine for displaying narration in the game. It receives a line of text and animates it character by character using a JavaScript `setInterval` loop, with the speed controlled by the `textSpeed` setting in the `useConfigStore`.

It directly implements the "click-to-complete, click-to-advance" logic. When the component itself is clicked, it intelligently decides whether to complete its own animation or emit an event to the `DialogueBox` to request the next line of narration.

---

## 2. Component API

### Props

| Prop   | Type     | Default | Description                               |
| ------ | -------- | ------- | ----------------------------------------- |
| `text` | `String` | `null`  | The line of text to be animated.          |

### Emitted Events

-   `@animationComplete`
    -   **Trigger:** The typewriter animation finishes.
    -   **Payload:** None.
-   `@requestNextLine`
    -   **Trigger:** The component is clicked *after* its animation is already complete.
    -   **Payload:** None.
