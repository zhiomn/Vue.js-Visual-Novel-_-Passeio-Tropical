# Component: MapApp

- **File Path:** `src/components/appMap/MapApp.vue`
- **Responsibility:** Root component and view controller for the Map application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component implements the standard "Master-Detail" UI pattern. It holds the local state (`currentCityId`) to switch between the list of discovered locations (`MapListView.vue`) and the detail page for a single location (`MapDetailView.vue`).

---

## 2. Component API

- **Props:** None
- **Emitted Events:** `@back` (when in the list view)
