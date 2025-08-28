# Component: TerminalText

- **File Path:** `src/components/ui/TerminalText.vue`
- **Responsibility:** To render a line of text with a typewriter effect, specifically for the Terminal app.

---

## 1. Design Philosophy

This component is a specialized version of a typewriter effect, themed for the `DialogueView` in the Terminal. It animates text character by character using GSAP for a smooth and controllable effect.

It implements the "click-to-complete, click-to-advance" logic internally. It exposes a `handleClick` method to its parent, which the parent can call. If the animation is running, `handleClick` completes it; if it's already complete, it emits a `requestNextLine` event.

---

## 2. Component API

### Props

| Prop   | Type     | Default | Description                                    |
| ------ | -------- | ------- | ---------------------------------------------- |
| `text` | `String` | `''`    | The line of text to be animated.               |

### Emitted Events

-   `@lineComplete`
    -   **Trigger:** The typewriter animation for the line finishes naturally.
    -   **Payload:** None.
-   `@requestNextLine`
    -   **Trigger:** The `handleClick` method is called *after* the animation is already complete.
    -   **Payload:** None.

### Exposed Methods

- `handleClick()`: The method the parent component (`DialogueView`) calls to trigger the complete/advance logic.
