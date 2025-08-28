# Component: MapListView

- **File Path:** `src/components/appMap/MapListView.vue`
- **Responsibility:** To display the master list of all discovered map locations.

---

## 1. Design Philosophy

This is a presentational component that renders a list of all map locations. It follows the principle of showing all potential content from the start.

-   **Locked State:** Locations that have not been causally unlocked (by viewing a contact's profile) are shown with an obfuscated name ("Local Desconhecido") and a placeholder icon.
-   **Unlocked State:** Once unlocked, the location's real name, country, and thumbnail are displayed.

---

## 2. Component API

### Props

| Prop        | Type    | Default | Description                                            |
| ----------- | ------- | ------- | ------------------------------------------------------ |
| `locations` | `Array` | `[]`    | The array of location objects to be rendered.          |

### Emitted Events

-   `@locationSelected (cityId)`
    -   **Trigger:** User clicks on an unlocked location.
    -   **Payload:** The `id` of the selected city.
