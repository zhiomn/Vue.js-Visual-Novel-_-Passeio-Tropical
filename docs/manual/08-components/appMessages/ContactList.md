# Component: ContactList

- **File Path:** `src/components/appMessages/ContactList.vue`
- **Responsibility:** To display the master list of all message conversations.

---

## 1. Design Philosophy

This is a presentational component responsible for rendering a vertical list of conversations. It receives a pre-sorted array of contacts and renders a row for each one. Each row displays the contact's avatar, name, and the first line of the most recent message.

It also checks for unread status to display a visual indicator, providing a clear cue to the player about new content.

---

## 2. Component API

### Props (Input Properties)

| Prop       | Type    | Default | Description                                                |
| ---------- | ------- | ------- | ---------------------------------------------------------- |
| `contacts` | `Array` | `[]`    | The array of message thread objects to be rendered.        |

### Emitted Events

-   `@contactSelected (contactId)`
    -   **Trigger:** The user clicks on a contact's row.
    -   **Payload:** The `id` of the selected contact.
