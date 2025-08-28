# Component: GalleryGridView

- **File Path:** `src/components/appGallery/GalleryGridView.vue`
- **Responsibility:** To render a responsive 3-column grid of image thumbnails.

---

## 1. Design Philosophy

This is a highly reusable presentational component. It takes a generic array of `items` and is responsible only for rendering them in a grid. It handles the "locked" vs. "unlocked" visual state for each item, showing a placeholder with a lock icon if the item is not yet available. This makes it a versatile component that can be used for any type of media grid.

---

## 2. Component API

### Props (Input Properties)

| Prop    | Type    | Default | Description                                            |
| ------- | ------- | ------- | ------------------------------------------------------ |
| `items` | `Array` | `[]`    | The array of item objects to be rendered in the grid. Each object must have an `id`, `thumbnailUrl`, and `isUnlocked` property. |

### Emitted Events

-   `@itemSelected (itemObject)`
    -   **Trigger:** The user clicks on an unlocked item in the grid.
    -   **Payload:** The complete object for the selected item.
