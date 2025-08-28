# Component: MessagesApp

- **File Path:** `src/components/appMessages/MessagesApp.vue`
- **Responsibility:** To act as the root component and view controller for the Messages application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component follows the classic "Master-Detail" UI pattern. It holds the state that determines whether the user is looking at the list of conversations (the "Master" view, `ContactList.vue`) or a single conversation (the "Detail" view, `ChatView.vue`).

It renders one of the two child components based on the local state variable `currentContactId`. This makes the component a simple but powerful controller, delegating the actual presentation to its children.

---

## 2. Component API

This component is a top-level app component and does not have any props.

### Emitted Events

-   `@back`
    -   **Trigger:** The user clicks the back button *while in the master view (`ContactList`)*.
    -   **Payload:** None.

---

## 3. Store Dependencies

-   **`useContentStore`:** Used to fetch the sorted list of message threads to pass down to the `ContactList` component.
