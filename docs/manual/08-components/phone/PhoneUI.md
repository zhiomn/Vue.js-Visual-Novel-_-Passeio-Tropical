# Component: PhoneUI

- **File Path:** `src/components/phone/PhoneUI.vue`
- **Responsibility:** To act as the root component for the entire in-game phone interface.

---

## 1. Design Philosophy

**Analogy: The Phone's Hardware and OS Shell.**

This component serves as the container for the phone's "hardware" and its two primary states: the Home Screen and an Active App. It uses a dynamic Vue component (`<component :is="...">`) to render the correct view based on the state of `phoneStore.activeApp`.

-   If `activeApp` is `null`, it renders the home screen, which consists of a grid of `PhoneAppIcon` child components.
-   If `activeApp` has an app ID (e.g., "messages"), it renders the corresponding app's main component from a component map.

This approach makes the PhoneUI highly scalable. To add a new app to the phone, we only need to add its data to `apps.json` and register its main component in the `appComponentMap` within this file.

---

## 2. Component API

This component is largely self-contained and does not have any props.

### Emitted Events

This component does not emit any events. It interacts directly with the `usePhoneStore` to manage its state.

---

## 3. Store Dependencies

-   **`usePhoneStore`:** Heavily used to determine if the phone is visible, which app is active, and the unlocked status of each app icon.
-   **`useNotificationStore`:** Used to display a notification badge on the phone toggle button if there are any unread items.
-   **`useConfigStore`:** Used to check for `phoneOnly` mode.
