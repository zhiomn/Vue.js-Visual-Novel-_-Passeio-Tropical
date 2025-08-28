# Component: PhoneAppHeader

- **File Path:** `src/components/phone/PhoneAppHeader.vue`
- **Responsibility:** To provide a standardized header for all applications within the phone, ensuring a consistent look and feel.

---

## 1. Design Philosophy

This component is a fundamental piece of the phone's UI kit. Its key feature is the use of a `<slot>`. This allows for a flexible design pattern:

-   **Default Usage:** For simple apps, passing a `title` prop is sufficient. The component will render a standard centered title.
-   **Advanced Usage:** For apps that require a more complex header (like the `ChatView`, which needs an avatar and a name), the parent component can inject custom HTML directly into the slot, which will be rendered in place of the default title.

This makes the header both easy to use for simple cases and powerful enough for complex ones.

---

## 2. Component API

### Props (Input Properties)

| Prop       | Type      | Default | Description                                                                 |
| ---------- | --------- | ------- | --------------------------------------------------------------------------- |
| `title`    | `String`  | `''`    | The text to be displayed as the header title (used if the slot is empty). |
| `showBack` | `Boolean` | `true`  | Controls the visibility of the back arrow button.                           |

### Slots

-   **`default`**: Any content placed inside the `<PhoneAppHeader>` tags in a parent component will be rendered here, replacing the default `title`.

### Emitted Events

-   `@back`
    -   **Trigger:** The user clicks the back arrow button.
    -   **Payload:** None. The parent component is responsible for handling the back navigation logic.
