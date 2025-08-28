# Component: AudioListView

- **File Path:** `src/components/appAudio/AudioListView.vue`
- **Responsibility:** To display the master list of all discovered audio tracks.

---

## 1. Design Philosophy

A presentational component that renders a list of all audio tracks. It follows the principle of showing all potential content from the start.

-   **Locked State:** Tracks that have not been causally unlocked (by reading the corresponding note) are shown with an obfuscated title and a lock icon.
-   **Unlocked State:** Once unlocked, the track's real title and author are displayed.

---

## 2. Component API

### Props

| Prop     | Type    | Default | Description                                            |
| -------- | ------- | ------- | ------------------------------------------------------ |
| `tracks` | `Array` | `[]`    | The array of audio track objects to be rendered.       |

### Emitted Events

-   `@trackSelected (trackId)`
    -   **Trigger:** User clicks on an unlocked track.
    -   **Payload:** The `id` of the selected track.
