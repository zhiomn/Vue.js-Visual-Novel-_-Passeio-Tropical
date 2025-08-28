# Component: SegmentedControl

- **File Path:** `src/components/appAjustes/SegmentedControl.vue`
- **Responsibility:** To provide a theme-consistent control for selecting one option from a small set.

---

## 1. Design Philosophy

This component replaces the default browser `<select>` dropdown menu. It provides a more tactile, mobile-friendly interface that is common in modern native applications. It renders a group of buttons and manages which one is currently "active", ensuring only one can be selected at a time.

---

## 2. Component API

### Props (v-model)

| Prop         | Type    | Default | Description                                                          |
| ------------ | ------- | ------- | -------------------------------------------------------------------- |
| `modelValue` | `String`| `''`    | The currently selected option. Intended to be used with `v-model`.   |
| `options`    | `Array` | `[]`    | An array of strings representing the available options.              |

### Emitted Events

-   `@update:modelValue (newValue)`: The standard event for `v-model` compatibility. Emitted when the user clicks a new option.
