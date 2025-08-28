# Component: PhoneStatusBar

- **File Path:** `src/components/phone/PhoneStatusBar.vue`
- **Responsibility:** To display the top status bar of the phone, showing the time and notification icons.

---

## 1. Design Philosophy

This is a purely presentational component. Its purpose is to provide a realistic and dynamic status bar that gives the player feedback on in-game events. It reads from the `useNotificationStore` to reactively display icons when there is new, unread content available in other apps, encouraging the player to explore the phone.

---

## 2. Component API

This component is self-contained and does not have any props or emit any events.

---

## 3. Store Dependencies

-   **`useNotificationStore`:** Used to determine which notification icons (messages, notes, gallery, etc.) should be visible.
