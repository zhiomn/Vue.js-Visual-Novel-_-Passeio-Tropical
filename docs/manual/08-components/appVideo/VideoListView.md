# Component: VideoListView

- **File Path:** `src/components/appVideo/VideoListView.vue`
- **Responsibility:** To display the master list of all unlocked videos.

---

## 1. Design Philosophy

A presentational component that renders a list of all video items fetched from the `contentStore`. Each item displays its thumbnail, title, and category (if available), providing a clear and scannable index of the available video content.

---

## 2. Component API

### Props

| Prop     | Type    | Default | Description                                            |
| -------- | ------- | ------- | ------------------------------------------------------ |
| `videos` | `Array` | `[]`    | The array of video objects to be rendered.       |

### Emitted Events

-   `@video-selected (videoId)`
    -   **Trigger:** User clicks on a video item.
    -   **Payload:** The `id` of the selected video.
