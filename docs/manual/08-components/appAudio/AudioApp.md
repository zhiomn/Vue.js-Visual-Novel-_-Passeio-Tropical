# Component: AudioApp

- **File Path:** `src/components/appAudio/AudioApp.vue`
- **Responsibility:** Root component and view controller for the Audio application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component implements the standard "Master-Detail" UI pattern. It holds the local state (`currentTrackId`) to switch between the list of available audio tracks (`AudioListView.vue`) and the full-screen media player for a single track (`AudioDetailView.vue`).

---

## 2. Component API

- **Props:** None
- **Emitted Events:** `@back` (when in the list view)
