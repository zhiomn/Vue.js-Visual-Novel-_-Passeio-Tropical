# Component: Stars

- **File Path:** `src/components/Stars.vue`
- **Responsibility:** To render a dynamic, animated starfield background.

---

## 1. Design Philosophy

This is a purely presentational component used during the "Contemplative" game phases (`STARTING`, `ENDING`) to create a cinematic and focused atmosphere. It uses CSS animations and pseudo-elements to create a multi-layered parallax scrolling effect.

Its key feature is the use of a `<slot>`, which allows any other content (like the `DialogueBox`) to be rendered on top of the starfield, making it a flexible background component.

---

## 2. Component API

### Props

| Prop          | Type     | Default | Description                               |
| ------------- | -------- | ------- | ----------------------------------------- |
| `smallStars`  | `Number` | `700`   | The number of stars in the smallest layer. |
| `mediumStars` | `Number` | `200`   | The number of stars in the medium layer.  |
| `largeStars`  | `Number` | `100`   | The number of stars in the largest layer. |
