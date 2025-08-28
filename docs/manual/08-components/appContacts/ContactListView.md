# Component: ContactListView

- **File Path:** `src/components/appContacts/ContactListView.vue`
- **Responsibility:** To display the master list of all potential contacts in the game.

---

## 1. Design Philosophy

This is a presentational component that renders a list of all contacts defined in `pessoas.json`. It follows the principle of showing all content from the start.

-   **Locked State:** If a contact's details have not yet been causally unlocked, they are rendered with the name "???" and a placeholder avatar.
-   **Unlocked State:** Once details are unlocked, the contact's real name and avatar are displayed.

This provides the player with a clear sense of progression and discovery.

---

## 2. Component API

### Props (Input Properties)

| Prop       | Type    | Default | Description                                            |
| ---------- | ------- | ------- | ------------------------------------------------------ |
| `contacts` | `Array` | `[]`    | The full array of contact objects to be rendered.      |

### Emitted Events

-   `@contactSelected (contactId)`
    -   **Trigger:** The user clicks on a contact's row (only if it's unlocked).
    -   **Payload:** The `id` of the selected contact.
