# Component: GalleryApp

- **File Path:** `src/components/appGallery/GalleryApp.vue`
- **Responsibility:** To act as the root component and multi-view controller for the Gallery application.

---

## 1. Design Philosophy

**Analogy: A Multi-View Navigation Controller.**

Unlike simple Master-Detail apps, the Gallery has a more complex navigation structure. This component manages that complexity. It holds local state (`viewMode`, `currentItemId`) to control three distinct layers of UI:

1.  **Folder View (`viewMode: 'folders'`):** The top-level view, shown in Run 2+, that lets the user choose between "Revistas" and "Pinturas". Rendered by `GalleryFolderView`.
2.  **Grid View (`viewMode: 'revistas'` or `'pinturas'`):** The standard view that shows a grid of thumbnails. Rendered by `GalleryGridView`.
3.  **Lightbox Overlay:** A full-screen view for a single image, which is rendered on top of the current view when `currentItemId` is set. Rendered by `GalleryLightboxView`.

The "back" button logic in this component is also more complex, navigating up the view hierarchy (from lightbox to grid, from grid to folders) before finally emitting the `@back` event to close the app.

---

## 2. Component API

This is a top-level app component and has no props.

### Emitted Events

-   `@back`
    -   **Trigger:** The user clicks the back button *while in the top-level view* (either Grid view in Run 1, or Folder view in Run 2+).
    -   **Payload:** None.
