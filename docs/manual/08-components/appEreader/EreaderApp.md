# Component: EreaderApp

- **File Path:** `src/components/appEreader/EreaderApp.vue`
- **Responsibility:** Root component and view controller for the E-Reader ("Estante") application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component implements the "Master-Detail" UI pattern. It holds the local state (`currentObraId`) to switch between the list of available magazines (`ObraListView.vue`) and the PDF viewer for a single magazine (`ObraDetailView.vue`).

---

## 2. Component API

- **Props:** None
- **Emitted Events:** `@back` (when in the list view)
