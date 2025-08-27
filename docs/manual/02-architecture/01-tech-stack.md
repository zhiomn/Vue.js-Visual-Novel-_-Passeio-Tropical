# 2.1 Technology Stack

This document serves as the single source of truth for the core technologies and libraries used in the "Tropical Versos" project. Each choice was made to align with our core philosophies of **Clarity**, **Friction Aversion**, and **Future-Self Principle**.

---

### Core Framework
-   **Vue 3 (Composition API):** Chosen for its reactive and component-based architecture. The Composition API, in particular, allows for organizing logic by feature, which greatly enhances code clarity and maintainability.
-   **Vite:** The build tool and development server. Its near-instant Hot Module Replacement (HMR) and simple configuration drastically reduce friction during the development cycle.

---

### State Management
-   **Pinia:** The official state management library for Vue. Its simple, intuitive API, full TypeScript support, and modular structure (stores) make managing application state clear and scalable.

---

### Flow & Logic Orchestration
-   **XState:** Used for managing complex, asynchronous event flows. It allows us to transform implicit, fragile `async/await` chains into explicit, robust, and visualizable Finite State Machines. This is a primary tool for achieving **Cognitive Clarity**.
-   **GSAP (GreenSock Animation Platform):** The professional-grade animation library for the web. It replaces CSS transitions and `setTimeout` hacks with a robust, JavaScript-based timeline system. This **eliminates sync issues** between logic and animation, providing full control and enhancing maintainability.
-   **Howler.js:** A dedicated audio library for the modern web. It abstracts away the complexities and browser inconsistencies of the Web Audio API and HTML5 Audio, providing a clean and reliable API for all audio operations, including fades and effects.

---

### Testing
-   **Vitest:** The testing framework. Chosen for its seamless integration with Vite, minimizing configuration friction. Its fast performance and Jest-compatible API provide a robust "safety net" that protects our Future Selves from regressions.
-   **Vue Test Utils:** The official library for testing Vue components, allowing us to verify UI rendering and behavior in isolation.

---

### Tooling & Environment
-   **JavaScript (ESM):** We use modern JavaScript modules as the primary language.
-   **Standard CSS with Variables:** Avoids the complexity of pre-processors. A well-organized CSS variable system provides sufficient power for theming and consistency.
-   **Prettier & ESLint:** Enforce a consistent code style, reducing cognitive load and eliminating debates over formatting.
