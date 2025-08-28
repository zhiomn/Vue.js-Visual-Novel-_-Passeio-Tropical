# Component: ObraListView

- **File Path:** `src/components/appEreader/ObraListView.vue`
- **Responsibility:** To display the master list of all discoverable magazines.

---

## 1. Design Philosophy

This presentational component renders a list of all magazines. It follows the principle of showing all potential content from the start.

-   **Locked State:** Magazines that have not been causally unlocked (by viewing the cover in the Gallery) are shown with an obfuscated name ("???") and a placeholder cover.
-   **Unlocked State:** Once unlocked, the magazine's real title, date, and cover thumbnail are displayed.

---

## 2. Component API

### Props

| Prop    | Type    | Default | Description                                            |
| ------- | ------- | ------- | ------------------------------------------------------ |
| `obras` | `Array` | `[]`    | The array of magazine objects to be rendered.          |

### Emitted Events

-   `@obraSelected (obraId)`
    -   **Trigger:** User clicks on an unlocked magazine.
    -   **Payload:** The `id` of the selected magazine.
