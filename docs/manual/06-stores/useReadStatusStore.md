# Store: useReadStatusStore

- **File Path:** `src/stores/readStatus.js`
- **Responsibility:** To track what content the player has seen/read and to manage the game's **causal unlock** logic.

---

## 1. Design Philosophy

**Analogy: The Achievement & Unlocks Manager.**

This store serves two critical, related functions:

1.  **Tracking "Read" Status:** It maintains sets of IDs for each content type (`notes`, `messages`, `gallery`, etc.) to track exactly what the player has interacted with. This is used primarily for UI cues (e.g., the "unread" dot in the messages app).

2.  **Driving Causal Unlocks:** This is its most important architectural role. The `markAsRead` action is the central trigger for the game's secondary progression system. When an item is marked as read, this store contains the logic to determine if that action should unlock a different, related piece of content (e.g., reading a note unlocks a gallery image). This logic is detailed in the `04-content-schema/02-causal-unlocks.md` document.

Like the `playerStore`, its state is **persistent** and saved to `LocalStorage`.

---

## 2. Store API

### State Properties

| Property          | Type  | Description                                                                                         |
| ----------------- | ----- | --------------------------------------------------------------------------------------------------- |
| `readIds`         | `Object` | An object containing a `Set` of IDs for each content type that has been marked as read.           |
| `unlockedContent` | `Object` | An object containing a `Set` of IDs for each content type that has been unlocked via a causal trigger. |
| `viewedSceneIds`  | `Set` | A set of scene IDs that have been visited, used as a trigger for unlocking painter-related content.   |

### Getters

-   `isRead(type, id)`: Checks if a specific item has been marked as read.
-   `isContentUnlocked(type, id)`: Checks if a specific item has been unlocked by the causal system.
-   `isSceneViewed(sceneId)`: Checks if a specific scene has been visited.

### Actions

-   `markAsRead(type, id)`: The core action of the store. It adds an ID to the appropriate `readIds` set and then immediately runs the causal unlock logic, potentially adding new IDs to the `unlockedContent` sets.
-   `markSceneAsViewed(sceneId)`: Adds a scene ID to the `viewedSceneIds` set. This also functions as a causal unlock trigger.
-   `saveReadStatus()` / `loadReadStatus()`: Manages persistence with `LocalStorage`.
