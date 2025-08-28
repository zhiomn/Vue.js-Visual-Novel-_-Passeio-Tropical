# Component: TerminalApp

- **File Path:** `src/components/appTerminal/TerminalApp.vue`
- **Responsibility:** Root component and view controller for the Terminal application.

---

## 1. Design Philosophy

**Analogy: The View Controller.**

This component manages the two main states of the Terminal: the list of available AIs to contact (`TerminalView.vue`) and the dialogue sequence with a selected AI (`DialogueView.vue`). It uses a `currentView` state variable to switch between these children. It's also responsible for handling the logic after a dialogue is complete, such as activating a new app via `playerStore`.

---

## 2. Component API

- **Props:** None
- **Emitted Events:** `@back` (when in the AI list view)
