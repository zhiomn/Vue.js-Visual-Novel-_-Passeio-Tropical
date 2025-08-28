# Component: NoteListView

- **File Path:** `src/components/appNotes/NoteListView.vue`
- **Responsibility:** To display the master list of all unlocked notes.

---

## 1. Design Philosophy

This is a presentational component responsible for rendering a list of all notes available to the player. It receives the note data directly from the `useContentStore`.

A key feature is its handling of the "unread" state. If a note has not yet been read (as determined by `useReadStatusStore`), its title is obfuscated as "???". This creates a clear incentive for the player to click and discover new content. The unread state is also highlighted with a colored border.

---

## 2. Component API

This component does not accept any props, as it reads directly from the `contentStore`.

### Emitted Events

-   `@noteSelected (noteId)`
    -   **Trigger:** The user clicks on a note item in the list.
    -   **Payload:** The `id` of the selected note (e.g., `note_1`).

---

## 3. Store Dependencies

-   **`useContentStore`:** Used to get the array of `unlockedNotes`.
-   **`useReadStatusStore`:** Used to check the read status of each note (`isRead`) to control its visual appearance.
