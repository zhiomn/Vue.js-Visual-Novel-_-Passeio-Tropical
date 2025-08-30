# Component: VideoApp

- **File Path:** `src/components/appVideo/VideoApp.vue`
- **Responsibility:** Root component and view controller for the Video application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component implements the standard "Master-Detail" UI pattern. It holds the local state (`currentVideoId`) to switch between the list of available videos (`VideoListView.vue`) and the full-screen player for a single video (`VideoDetailView.vue`).

---

## 2. Component API

- **Props:** None
- **Emitted Events:** `@back` (when in the list view)
