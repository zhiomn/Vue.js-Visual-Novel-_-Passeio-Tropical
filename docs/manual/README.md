# Tropical Versos: Project Manual

This manual serves as the single source of truth for the architecture, design, and philosophy of the Tropical Versos project. It is a living document, intended to be updated as the project evolves.

## Table of Contents

### Section 01: Foundations
This section covers the core principles and philosophies that guide all development decisions. It also contains the strict rules for our human-AI collaborative workflow. **All collaborators must read this section first.**

### Section 02: Architecture
This section provides a high-level overview of the project's technical architecture, including the tech stack, state management philosophy, and the lifecycle of a user action.

### Section 03: Game Design
This section details the rules and mechanics of the game from the player's perspective, including the core game loop and the multi-layered app unlock system.

### Section 04: Content Schema
This section is the guide to the game's "database" located in `/src/data`. It explains the purpose of each JSON file and details the logic of the Causal Unlock System.

### Section 05: Stores (SoT)
A modular documentation of each Pinia store, detailing its specific responsibility, state properties, and API.

### Section 06: Services (SoT)
A modular documentation of stateless services, focusing on the `runOrchestrator` which acts as the game's "maestro".

### Section 07: Components (SoT)
A modular documentation of all reusable Vue components, acting as a "Component Library" manual.
