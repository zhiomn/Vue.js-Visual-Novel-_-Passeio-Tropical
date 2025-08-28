# Component: RevealButton

- **File Path:** `src/components/ui/RevealButton.vue`
- **Responsibility:** To render a button whose text appears with a staggered, random reveal animation.

---

## 1. Design Philosophy

This component is used in the "Contemplative" game phases to make the appearance of choices feel more deliberate and cinematic. It takes a string of text, wraps each character in a `<span>`, and uses GSAP to animate the opacity of each character individually, creating a stylish reveal effect. It is a direct replacement for a standard `<button>` but with enhanced visual flair.

---

## 2. Component API

### Props

| Prop          | Type      | Default | Description                                                               |
| ------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `text`        | `String`  | `''`    | The text to be displayed and animated on the button.                      |
| `disabled`    | `Boolean` | `false` | A standard disabled flag that is passed down to the underlying `<button>`. |
| `buttonClass` | `String`  | `''`    | Any additional CSS classes to apply to the button (e.g., `special-btn`).   |

### Emitted Events

-   `@click`
    -   **Trigger:** The user clicks the button.
    -   **Payload:** None.
