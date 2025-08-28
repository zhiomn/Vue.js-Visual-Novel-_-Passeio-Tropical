# Store: useConfigStore

- **File Path:** `src/stores/config.js`
- **Responsibility:** To manage game-wide configuration and user-configurable settings.

---

## 1. Design Philosophy

**Analogy: The Game's Engine Configuration and Settings Menu.**

This store is the single source of truth for all configuration data, loaded directly from `/src/data/config.json`. It cleanly separates static game configuration (like `totalRuns`) from dynamic user settings (like `musicVolume`).

Its design is data-driven. The "Ajustes" (Settings) app is built entirely from the `settings` object within this store, allowing new settings to be added to the game simply by modifying the `config.json` file, without needing to change the Vue component code.

Its state is **persistent**, saving user preferences to `LocalStorage`.

---

## 2. Store API

### State Properties

| Property    | Type     | Description                                                                                           |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `settings`  | `Object` | An object containing all user-configurable settings, including their label, value, group, and options. |
| `gameTitle` | `String` | The title of the game.                                                                                |
| `version`   | `String` | The current version of the game.                                                                      |
| `totalRuns` | `Number` | The total number of gameplay runs designed for the game.                                              |
| `phoneOnly` | `Boolean`| **[Dev Flag]** A developer flag to force the phone to be always visible for easier UI testing.         |

### Getters

-   `getSetting(key)`: Returns the entire setting object for a given key.
-   `getSettingValue(key)`: Returns just the `value` of a specific setting. This is the most commonly used getter.

### Actions

-   `updateSetting({ key, value })`: Updates the value of a specific setting.
-   `saveSettingsToLocalStorage()`: Serializes the `settings` object and saves it to `LocalStorage`.
-   `loadSettingsFromLocalStorage()`: Loads user settings from `LocalStorage` when the game starts.
