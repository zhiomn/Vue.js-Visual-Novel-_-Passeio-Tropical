# Component: PhoneAppIcon

- **File Path:** `src/components/phone/PhoneAppIcon.vue`
- **Responsibility:** To render a single application icon on the phone's home screen.

---

## 1. Design Philosophy

This component is the primary interactive element of the home screen. It is designed to clearly communicate the state of an application (locked or unlocked) through its visual appearance.

-   **Unlocked State:** Displays the app's name, its colored icon, and its gradient background. It is clickable.
-   **Locked State:** Displays "???" as the name, a generic lock icon, and a muted gray background. It is not clickable.

This clear visual distinction provides immediate feedback to the player about their progression.

---

## 2. Component API

### Props (Input Properties)

| Prop         | Type      | Default | Description                                                        |
| ------------ | --------- | ------- | ------------------------------------------------------------------ |
| `appName`    | `String`  | `''`    | The name of the application.                                       |
| `appIcon`    | `String`  | `''`    | The Font Awesome class for the icon (e.g., `fa-solid fa-comments`). |
| `appColor`   | `String`  | `''`    | The CSS `background` value (typically a linear gradient).          |
| `isUnlocked` | `Boolean` | `false` | The crucial flag that controls the visual state of the icon.       |

### Emitted Events

-   `@open`
    -   **Trigger:** The player clicks on the icon. This event is only emitted if `isUnlocked` is `true`.
    -   **Payload:** None.
