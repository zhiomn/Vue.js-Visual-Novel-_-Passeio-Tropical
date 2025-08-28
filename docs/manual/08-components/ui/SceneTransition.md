# Component: SceneTransition

- **File Path:** `src/components/ui/SceneTransition.vue`
- **Responsibility:** To display the main background image for a scene and handle the animated transition between scenes.

---

## 1. Design Philosophy

This component is the visual foundation of the "exploration" mode of the game. It is designed to be simple and robust. Its core functionality is managed by Vue's built-in `<transition>` component, which handles the cross-fade effect between a departing and an arriving image.

The actual fade-to-black/fade-from-black effect during scene transitions is handled by a separate `.fade-overlay` element within this component, which is controlled directly by the `useDisplayStore`'s GSAP animations. This separates the responsibility of the cross-fade between images from the fade of the entire scene.

---

## 2. Component API

### Props (Input Properties)

| Prop            | Type     | Default | Description                                            |
| --------------- | -------- | ------- | ------------------------------------------------------ |
| `backgroundUrl` | `String` | `''`    | The URL of the background image to be displayed. The component uses this as a `:key` to trigger the transition animation whenever the URL changes. |
