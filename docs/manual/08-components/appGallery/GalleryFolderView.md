# Component: GalleryFolderView

- **File Path:** `src/components/appGallery/GalleryFolderView.vue`
- **Responsibility:** To display the top-level folders ("Capas de Revistas", "Pinturas") in the gallery.

---

## 1. Design Philosophy

This is a presentational component that provides a high-level overview of the gallery's contents. Its key feature is the dynamic generation of folder preview images. For each folder, it randomly selects up to four **unlocked** items from the corresponding content array and displays their thumbnails in a 2x2 grid. This makes the home screen feel dynamic and reflective of the player's discoveries.

---

## 2. Component API

### Props (Input Properties)

| Prop       | Type    | Default | Description                                                 |
| ---------- | ------- | ------- | ----------------------------------------------------------- |
| `revistas` | `Array` | `[]`    | The full array of magazine cover objects.                   |
| `pinturas` | `Array` | `[]`    | The full array of painting objects.                         |

### Emitted Events

-   `@folderSelected (folderName)`
    -   **Trigger:** The user clicks on a folder.
    -   **Payload:** The name of the selected folder (`'revistas'` or `'pinturas'`).
