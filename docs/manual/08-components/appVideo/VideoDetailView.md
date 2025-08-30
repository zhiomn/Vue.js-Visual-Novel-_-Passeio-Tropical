# Component: VideoDetailView

- **File Path:** `src/components/appVideo/VideoDetailView.vue`
- **Responsibility:** To display a selected video in an embedded player with its description.

---

## 1. Design Philosophy

This is the "detail" view for the Video app. Its primary feature is an `<iframe>` that loads a YouTube video, parsing the correct embed URL from the link provided in `videos.json`. It manages a loading state to provide user feedback while the `iframe` is loading. The entire component view is scrollable, adhering to the standard app layout.

---

## 2. Component API

### Props

| Prop     | Type     | Default | Description                                              |
| -------- | -------- | ------- | -------------------------------------------------------- |
| `videoId`| `String` | `''`    | The ID of the video whose content should be displayed.    |

- **Emitted Events:** None
