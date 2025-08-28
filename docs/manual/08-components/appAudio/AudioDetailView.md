# Component: AudioDetailView

- **File Path:** `src/components/appAudio/AudioDetailView.vue`
- **Responsibility:** To display a full-screen media player for a selected audio track.

---

## 1. Design Philosophy

This is a stateful presentational component that provides a complete media player interface. It interacts heavily with the `useAudioStore` to play/pause the track, display the current time and duration, and handle seeking via a custom progress bar. It also contains the logic for navigating to the next/previous track in the playlist.

**Causal Unlock Trigger:** The `onMounted` lifecycle hook calls `readStatusStore.markAsRead('audio', props.trackId)`, ensuring that listening to a track marks it as "read" for any potential future game logic.

---

## 2. Component API

### Props

| Prop      | Type     | Default | Description                                              |
| --------- | -------- | ------- | -------------------------------------------------------- |
| `trackId` | `String` | `''`    | The ID of the track to be played.                        |

### Emitted Events

- `@trackSelected (trackId)`
    - **Trigger:** User clicks the next or previous track button.
    - **Payload:** The ID of the new track to be played.
