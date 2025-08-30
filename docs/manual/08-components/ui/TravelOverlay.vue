# Component: TravelOverlay

- **File Path:** `src/components/ui/TravelOverlay.vue`
- **Responsibility:** To render the full-screen, cinematic UI for the `TRAVELING` game phase.

---
## 1. Design Philosophy
This component provides a cinematic, contemplative interstitial screen that separates one exploration scene from the next. It renders the `Stars.vue` component in the background and uses `RevealButton` child components to present the travel options to the player. This creates a distinct "Travel Mode" that enhances the game's pacing and atmosphere.

---
## 2. Component API
### Props
| Prop | Type | Description |
|---|---|---|
| `travelOptions` | `Array` | The available travel destinations (strings). |
