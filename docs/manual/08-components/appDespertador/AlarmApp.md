# Component: AlarmApp

- **File Path:** `src/components/appDespertador/AlarmApp.vue`
- **Responsibility:** To serve as a narrative gate for the "Architect's Awakening" event.

---

## 1. Design Philosophy

This is a simple, single-purpose component. Initially, it displays a placeholder "dormant" state. Its true function is unlocked late in the game. When the player meets the requirements, interacting with this app is intended to call the `playerStore.awakenArchitect()` action.

This action sets a global flag that is the requirement for unlocking the final AI (`Manual`) in the Terminal, which in turn unlocks the **Video App**. It acts as a key narrative and progression checkpoint.

*(Note: The current implementation only shows the dormant state. The interactive part is yet to be implemented.)*

---

## 2. Component API

- **Props:** None
- **Emitted Events:** `@back`
