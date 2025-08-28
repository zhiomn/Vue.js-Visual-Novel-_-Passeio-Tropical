# Component: TypewriterPreview

- **File Path:** `src/components/appAjustes/TypewriterPreview.vue`
- **Responsibility:** To display a sample text with a typewriter animation to preview the selected text speed.

---

## 1. Design Philosophy

This is a simple, single-purpose presentational component. It exists solely to provide real-time feedback within the Settings app. It receives text and a speed value, and re-runs a typewriter animation whenever the speed value changes. This directly follows our UX principle of **Immediate Feedback**.

---

## 2. Component API

### Props

| Prop    | Type     | Default | Description                                                      |
| ------- | -------- | ------- | ---------------------------------------------------------------- |
| `text`  | `String` | `''`    | The sample text to be animated.                                  |
| `speed` | `Number` | `50`    | A value (typically 10-100) that controls the animation speed.    |
