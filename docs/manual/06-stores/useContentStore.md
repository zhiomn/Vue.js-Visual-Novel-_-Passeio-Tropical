# Store: useContentStore

- **File Path:** `src/stores/contentStore.js`
- **Responsibility:** To act as the central hub for querying and processing all narrative and gameplay content.

---

## 1. Design Philosophy

**Analogy: The Game's Librarian or Query Engine.**

This store holds almost no state of its own. Its primary role is to provide a rich set of **getters** that read from the persistent state (`usePlayerStore`, `useReadStatusStore`) and the raw data files (`/src/data/*.json`) to produce computed, ready-to-use lists of content for the UI.

It is built around a `_masterContentMap`, which is initialized once and joins all related data (`escolhas`, `textos`, `pessoas`, etc.) into a single, easily accessible data structure. The getters then filter and shape the data from this map based on the player's current progress. This makes the store highly efficient, as the expensive data joining operation happens only once.

---

## 2. Store API

### State Properties

| Property                | Type    | Default Value | Description                                                               |
| ----------------------- | ------- | ------------- | ------------------------------------------------------------------------- |
| `_masterContentMap`     | `Map`   | `new Map()`   | **Internal:** A map where the key is `escolhaId` and the value is a large, joined content object. |
| `_isInitialized`        | `Boolean`| `false`      | **Internal:** A flag to ensure the master map is only built once.         |

### Getters

The getters are the public API of this store. They are designed to be self-contained selectors that provide specific slices of content.

-   `unlockedNotes`: Returns an array of all note objects the player has unlocked.
-   `unlockedMessages`: Returns an array of message threads, grouped by author.
-   `galleryContent`: Returns an object containing separate arrays for `revistas` and `pinturas`.
-   `unlockedContacts`: Returns a sorted array of all contact objects (authors and painters).
-   `unlockedAudioTracks`: Returns an array of all available audio track objects.
-   `unlockedMapLocations`: Returns an array of all discovered map location objects.
-   `unlockedObras`: Returns an array of all magazine objects for the e-reader.
-   `isContactUnread(contactId)`: A utility getter that checks if a specific message thread has unread messages.

### Actions

-   `_initializeMasterContentMap()`: **Internal action** called automatically by the getters on their first run to build the `_masterContentMap`.
