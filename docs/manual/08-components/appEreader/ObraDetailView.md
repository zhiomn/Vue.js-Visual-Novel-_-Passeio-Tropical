# Component: ObraDetailView

- **File Path:** `src/components/appEreader/ObraDetailView.vue`
- **Responsibility:** To display the PDF of a selected magazine in an iframe.

---

## 1. Design Philosophy

This is the "detail" view for the E-Reader. Its primary feature is an `<iframe>` that loads a PDF from an external URL (defined in `obras.json`). It also manages a simple "loading" state, showing a spinner while the iframe and its content are being loaded, which improves the user experience by providing feedback during network requests.

---

## 2. Component API

### Props

| Prop     | Type     | Default | Description                                              |
| -------- | -------- | ------- | -------------------------------------------------------- |
| `obraId` | `String` | `''`    | The ID of the magazine whose PDF should be displayed.    |

- **Emitted Events:** None
