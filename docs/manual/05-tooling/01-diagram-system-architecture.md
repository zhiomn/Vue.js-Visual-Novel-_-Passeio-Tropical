# 5.1 Diagram System Architecture

This document is the Source of Truth for the project's internal diagramming and visualization tools. It was created to solve the challenge of producing high-quality, elegant, and maintainable diagrams that are version-controlled alongside the source code.

This system is a direct result of our **"Elegance & DRY Solutions"** principle.

---

### 1. Core Philosophy: Data Decoupled from Presentation

The system is built on a fundamental principle: the data that defines a diagram's structure is stored separately from the code that renders it visually.

-   **Data Layer (`.json` files):** The structure of each diagram (its nodes and edges) is defined in a simple, human-readable JSON file. This is the **version-controlled source of truth** for the diagram's logic. This format is easily parsable by both our rendering engine and by AI for analysis.

-   **Presentation Layer (`diagram-renderer.js`):** A single, centralized JavaScript module is responsible for rendering all diagrams. It reads a `.json` file, calculates an optimal layout using the ElkJS library, and draws the final, interactive SVG using the D3.js library. This ensures all diagrams share a consistent, high-quality visual style defined in one place.

---

### 2. The Two Key Components

#### 2.1 The "Workbench" (`/docs/workbench/`)

-   **Purpose:** A development tool for **creating and analyzing** diagrams.
-   **Workflow:**
    1.  The user loads one or more of the game's actual source code files (e.g., from `/src/stores/`).
    2.  The `parser.js` module reads the raw code and automatically generates the graph structure (nodes and edges).
    3.  The `renderer.js` module visualizes this structure.
    4.  The developer can then copy the generated graph data and use it to create a final `.json` file for the official documentation.
-   **Key Feature:** Interactive, with an inspector panel and cross-linking capabilities to analyze the entire project's architecture.

#### 2.2 The Diagram Library (`/docs/diagrams/`)

-   **Purpose:** The official, "published" visual documentation of the project. This is the **canonical reference**.
-   **Workflow:**
    1.  The `index.html` page provides a navigable index of all official diagrams, powered by the `diagrams.json` manifest.
    2.  When a user clicks a link, the corresponding HTML file is loaded.
    3.  This HTML file is a minimal shell that calls the centralized `diagram-renderer.js`.
    4.  The renderer fetches the corresponding `.json` data file and renders the final, non-editable diagram.
-   **Key Feature:** Designed for clear presentation and navigation, serving as the visual companion to the textual `manual`.

This dual-system approach allows us to have a powerful, interactive tool for development (`Workbench`) and a clean, stable library of diagrams for reference (`Diagrams`), all powered by the same underlying DRY architecture.
