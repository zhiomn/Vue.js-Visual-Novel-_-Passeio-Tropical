# Store: usePhoneStore

- **File Path:** `src/stores/phone.js`
- **Responsibility:** To manage the state of the in-game phone, including its visibility and the lifecycle of its applications.

---

## 1. Design Philosophy

**Analogy: The Phone's Operating System (OS).**

This store acts as the phone's OS. It doesn't know *about* game content, but it knows what apps are *installed* and what their *state* is (locked, unlocked, active).

Its most important feature is the `getAppState` getter. This is a powerful, centralized piece of logic that consolidates all unlock rules (`requirements.json`, `playerStore` progress, Terminal activations) into a single function. Any component that needs to know the status of an app (like the `PhoneAppIcon`) uses this getter, ensuring the unlock rules are consistently applied everywhere.

---

## 2. Store API

### State Properties

| Property           | Type     | Default Value | Description                                                         |
| ------------------ | -------- | ------------- | ------------------------------------------------------------------- |
| `isPhoneVisible`   | `Boolean`| `false`       | Controls whether the entire phone UI is visible on the screen.      |
| `activeApp`        | `String` | `null`        | The `id` of the application that is currently open. `null` means the home screen is visible. |

### Getters

-   `getAppState(appId)`
    -   A crucial function that takes an app's ID and returns a comprehensive status object:
    -   `{ isUnlocked, areDetailsRevealed, meetsRequirements, isActivated }`
    -   This getter is the **single source of truth for all app unlock logic**.

### Actions

-   `openApp(appName)` / `closeApp()`
    -   Setters for the `activeApp` state, controlling which app is displayed.
-   `togglePhoneVisibility()`
    -   Toggles the `isPhoneVisible` boolean.
-   `activateApp(appId)`
    -   A special action called by the Terminal app to add an app to the `playerStore.activatedApps` list and then open it.
