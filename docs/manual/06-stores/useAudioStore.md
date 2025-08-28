# Store: useAudioStore

- **File Path:** `src/stores/audio.js`
- **Responsibility:** To manage the playback of all in-game audio using the Howler.js library.

---

## 1. Design Philosophy

**Analogy: The In-Game Media Player.**

This store acts as a centralized controller for all audio. It manages a singleton instance of a Howl object to prevent multiple tracks from playing simultaneously. It provides a clean and simple API for playing, pausing, and seeking tracks, abstracting away the complexities of the underlying audio library.

It also provides a dedicated action (`playSfxSample`) for "fire-and-forget" sound effects, which is used to provide real-time feedback in the UI (like in the Settings app) without interfering with the main music or audio track player.

---

## 2. Store API

### State Properties

| Property        | Type      | Default Value | Description                                                               |
| --------------- | --------- | ------------- | ------------------------------------------------------------------------- |
| `currentTrack`  | `Object`  | `null`        | The data object for the audio track that is currently loaded.             |
| `isPlaying`     | `Boolean` | `false`       | `true` if the audio player is currently playing.                          |
| `currentTime`   | `Number`  | `0`           | The current playback time in seconds. Updated by an internal timer.       |
| `duration`      | `Number`  | `0`           | The total duration of the current track in seconds.                       |
| `isSeeking`     | `Boolean` | `false`       | A flag to prevent the progress timer from overwriting the user's input while they are dragging the progress bar. |

### Actions

-   `playTrack(trackObject)`: The main action. If the track is new, it unloads the old one and loads/plays the new one. If it's the same track, it toggles between play and pause.
-   `playSfxSample(volume)`: Plays a short, non-interfering sound effect at a specified volume. Used for UI feedback.
-   `startSeeking()` / `endSeeking(time)`: Manages the `isSeeking` state to allow for smooth progress bar scrubbing.
-   `updateVolume()`: Reads the volume from `useConfigStore` and applies it to the current Howl instance.
