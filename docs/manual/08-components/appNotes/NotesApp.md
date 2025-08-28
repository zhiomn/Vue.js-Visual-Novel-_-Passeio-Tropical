# Component: NotesApp

- **File Path:** `src/components/appNotes/NotesApp.vue`
- **Responsibility:** To act as the root component and view controller for the Notes application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component implements the "Master-Detail" UI pattern, consistent with other list-based apps like `MessagesApp`. It holds the local state (`currentNoteId`) that determines whether the user is viewing the list of all notes (the "Master" view, `NoteListView.vue`) or the content of a single note (the "Detail" view, `NoteDetailView.vue`).

Its primary role is to manage the flow between these two child components.

---

## 2. Component API

This is a top-level app component and does not have any props.

### Emitted Events

-   `@back`
    -   **Trigger:** The user clicks the back button *while in the master view (`NoteListView`)*.
    -   **Payload:** None.
