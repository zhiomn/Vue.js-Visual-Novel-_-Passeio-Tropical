# Component: ChatView

- **File Path:** `src/components/appMessages/ChatView.vue`
- **Responsibility:** To display the detail view of a single message conversation.

---

## 1. Design Philosophy

This is a presentational component that renders the full history of a conversation. It receives a `contactId`, fetches the corresponding data from the `useContentStore`, and displays the messages as chat bubbles.

A key feature is its use of the `<slot>` in the `PhoneAppHeader`. It injects a custom header containing the contact's avatar and name, creating a polished and context-specific title bar. It also marks messages as "read" by calling the `useReadStatusStore` when a message bubble is clicked.

---

## 2. Component API

### Props (Input Properties)

| Prop        | Type     | Default | Description                                          |
| ----------- | -------- | ------- | ---------------------------------------------------- |
| `contactId` | `String` | `''`    | The ID of the contact whose conversation should be displayed. |

### Emitted Events

-   `@back`
    -   **Trigger:** The user clicks the back button in the header.
    -   **Payload:** None.
