# Component: NoteDetailView

- **File Path:** `src/components/appNotes/NoteDetailView.vue`
- **Responsibility:** To display the full content of a single selected note.

---

## 1. Design Philosophy

This is a presentational "detail" component that renders the title, author, and full text of a note. It is also a critical component in the game's progression system.

**Causal Unlock Trigger:** The `onMounted` lifecycle hook of this component calls the `readStatusStore.markAsRead('notes', props.noteId)` action. This single action is the **primary trigger** for the entire causal unlock system. The act of viewing a note is what unlocks associated gallery images, author details, and audio tracks. This behavior is central to the game's discovery loop.

---

## 2. Component API

### Props (Input Properties)

| Prop     | Type     | Default | Description                                          |
| -------- | -------- | ------- | ---------------------------------------------------- |
| `noteId` | `String` | `''`    | The ID of the note whose content should be displayed. |

This component does not emit any events.

---

## 3. Store Dependencies

-   **`useContentStore`:** Used to find the specific note object that matches the `noteId` prop.
-   **`useReadStatusStore`:** Used to call `markAsRead` when the component is mounted.
