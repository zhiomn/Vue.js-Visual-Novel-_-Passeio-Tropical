# Component: GalleryLightboxView

- **File Path:** `src/components/appGallery/GalleryLightboxView.vue`
- **Responsibility:** To display a selected image in a full-screen overlay with a caption.

---

## 1. Design Philosophy

This component functions as a modal or overlay that takes over the entire screen to focus on a single piece of content.

**Causal Unlock Trigger:** Like `NoteDetailView`, the `onMounted` lifecycle hook of this component is a critical causal trigger. It calls `readStatusStore.markAsRead('gallery', props.itemId)`.
-   If the item is a **magazine cover**, this action unlocks the corresponding magazine in the **E-Reader App**.
-   If the item is a **painting**, this action unlocks the full details of the **painter** in the **Contacts App**.

---

## 2. Component API

### Props (Input Properties)

| Prop       | Type     | Default | Description                                                     |
| ---------- | -------- | ------- | --------------------------------------------------------------- |
| `itemId`   | `String` | `''`    | The unique ID of the gallery item to display.                   |
| `itemType` | `String` | `''`    | The type of item (`'revista'` or `'pintura'`) to help the component find the data in the correct array within the `contentStore`. |

### Emitted Events

-   `@close`
    -   **Trigger:** The user clicks the back button or outside the main image.
    -   **Payload:** None.
