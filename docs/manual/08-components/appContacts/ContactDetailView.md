# Component: ContactDetailView

- **File Path:** `src/components/appContacts/ContactDetailView.vue`
- **Responsibility:** To display the detailed profile of a single selected contact.

---

## 1. Design Philosophy

This is a presentational "detail" component that renders all known information about a person (name, location, bio, etc.).

**Causal Unlock Trigger:** The `onMounted` lifecycle hook of this component calls the `readStatusStore.markAsRead('contacts', props.contactId)` action. This is a key causal trigger. The act of viewing a contact's profile is what unlocks their associated home city in the **Map App**, creating a logical chain of discovery for the player.

---

## 2. Component API

### Props (Input Properties)

| Prop        | Type     | Default | Description                                              |
| ----------- | -------- | ------- | -------------------------------------------------------- |
| `contactId` | `String` | `''`    | The ID of the contact whose profile should be displayed. |

This component does not emit any events.

---

## 3. Store Dependencies

-   **`useContentStore`:** Used to find the specific contact object matching the `contactId` prop.
-   **`useReadStatusStore`:** Used to call `markAsRead` when the component is mounted.
