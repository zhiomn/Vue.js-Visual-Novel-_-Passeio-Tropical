# Component: MapDetailView

- **File Path:** `src/components/appMap/MapDetailView.vue`
- **Responsibility:** To display detailed information about a single selected location.

---

## 1. Design Philosophy

This is a presentational "detail" component. It receives a `cityId`, finds the corresponding data, and displays its name, photo, and a description. A key feature is that it also queries the `contentStore` to find and list all **unlocked contacts** who are from that city, creating a cross-reference within the phone's ecosystem.

---

## 2. Component API

### Props

| Prop     | Type     | Default | Description                                              |
| -------- | -------- | ------- | -------------------------------------------------------- |
| `cityId` | `String` | `''`    | The ID of the city whose details should be displayed.    |

- **Emitted Events:** None
