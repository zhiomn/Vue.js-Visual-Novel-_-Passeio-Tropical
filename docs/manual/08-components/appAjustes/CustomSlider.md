# Component: CustomSlider

- **File Path:** `src/components/appAjustes/CustomSlider.vue`
- **Responsibility:** To provide a theme-consistent, custom slider control.

---

## 1. Design Philosophy

This component replaces the default browser `<input type="range">` to ensure a consistent visual appearance that matches the game's "Phone OS" theme. It is built with `<div>` elements and styled with CSS. It handles user interaction (clicking and dragging) to calculate and emit its new value, making it a fully functional, themeable replacement.

---

## 2. Component API

### Props (v-model)

| Prop         | Type     | Default | Description                                                        |
| ------------ | -------- | ------- | ------------------------------------------------------------------ |
| `modelValue` | `Number` | `0`     | The current value of the slider. Intended to be used with `v-model`. |
| `min`        | `Number` | `0`     | The minimum value of the slider.                                   |
| `max`        | `Number` | `100`   | The maximum value of the slider.                                   |
| `step`       | `Number` | `1`     | The increment value for the slider.                                |

### Emitted Events

-   `@update:modelValue (newValue)`: The standard event for `v-model` compatibility. Emitted when the value changes.
-   `@input (newValue)`: Emitted continuously *while the user is dragging the slider*. This is used for real-time feedback (like the volume SFX).
