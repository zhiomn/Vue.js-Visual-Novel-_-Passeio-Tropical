# 3.2 App Unlock & Progression System

This document details the complete flow and specific conditions required to unlock every application in "Tropical Versos".

---

## 1. Core Unlock Mechanisms

The progression system is built upon three distinct layers that work in sequence.

### Layer 1: Discovery-Based Unlocks (Choice Count)
This is the primary engine driving game progression. The total number of unique choices the player has made across all runs (`playerStore.unlockedChoiceCount`) is the key metric.
- **Source of Truth:** `src/data/requirements.json`
- **Logic:** When `unlockedChoiceCount` reaches a specific threshold defined in `requirements.json`, the corresponding app becomes visible on the phone's home screen.

### Layer 2: Agency-Based Unlocks (The Terminal)
Certain apps, after becoming visible, remain locked and require direct player action to activate.
- **Mechanism:** Apps marked with `"requiresTerminalUnlock": true` in `src/data/apps.json`.
- **Logic:** The player must open the Terminal app, contact the specific AI entity linked to the locked app (defined in `src/data/ais.json`), and complete the dialogue. This triggers the `playerStore.addActivatedApp()` action, fully unlocking the app.

### Layer 3: Event-Based Unlocks (The Architect's Awakening)
The final unlock is triggered not by a count, but by a specific world-state flag.
- **Mechanism:** The `playerStore.hasArchitectAwakened` boolean flag.
- **Logic:** The player must use the **Alarm Clock (Despertador)** app, which is the designated tool for triggering this event. Using it calls the `playerStore.awakenArchitect()` action, sets the flag to `true`, and satisfies the `"architect_awakened"` requirement for the final app and AI.

---

## 2. Application Unlock Cheatsheet

Below is a detailed list of every application and its specific unlock path.

### Group A: Standard Discovery Unlocks
These apps are unlocked directly by reaching a choice count threshold.
-   **Ajustes (Settings):** 0 choices
-   **Mensagens (Messages):** 1 choice
-   **Anotações (Notes):** 3 choices
-   **Galeria (Gallery):** 6 choices

### Group B: Terminal Activation Required
These apps become visible after a choice count but must be activated via the Terminal.
-   **Terminal:** 8 choices. Activates the **Codex** AI.
-   **Contatos (Contacts):** 8 choices. Requires activation via **Nexus**.
-   **Mapa (Map):** 11 choices. Requires activation via **Vetor**.
-   **Sobre (Info):** 13 choices. Requires activation via **an unassigned AI**.
-   **Áudios (Audio):** 15 choices. Requires activation via **Sinal**.
-   **Estante (E-Reader):** 18 choices. Requires activation via **Trama**.
-   **Alarme (Alarm Clock):** 21 choices. Requires activation via **Pulso**.

### Group C: Final Event Unlock
-   **Vídeos (Videos):** Requires the `architect_awakened` flag (set by using the Alarme). Activated via **Manual**.
