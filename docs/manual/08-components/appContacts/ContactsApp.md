# Component: ContactsApp

- **File Path:** `src/components/appContacts/ContactsApp.vue`
- **Responsibility:** To act as the root component and view controller for the Contacts application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component implements the standard "Master-Detail" UI pattern. It holds the local state (`currentContactId`) that determines whether the user is viewing the list of all contacts (the "Master" view, `ContactListView.vue`) or the profile of a single contact (the "Detail" view, `ContactDetailView.vue`).

---

## 2. Component API

This is a top-level app component. It does not have any props.

### Emitted Events

-   `@back`
    -   **Trigger:** The user clicks the back button *while in the master view (`ContactListView`)*.
    -   **Payload:** None.
