# 3.1 Game Loop & Progression Specification

## 1. Core Philosophy

The game "Tropical Versos" is designed around a core loop of repeated playthroughs, referred to as **Runs**. The primary goal is not to "win" in a single run, but to gradually uncover the full narrative and unlock all game mechanics through a process of exploration and discovery across multiple runs.

Progression is persistent. Each choice the player makes permanently contributes to their overall progress, unlocking new content and capabilities in subsequent runs.

## 2. Fundamental Concepts

### 2.1. Run
A **Run** is a single, complete gameplay session, from the starting scene to an ending sequence. The game is designed to be played for a total of 3 runs.

- **Source of Truth:** `data/inicios.json`, `data/finais.json`
- **State Management:** `playerStore.runCount` tracks the current run number.

### 2.2. Scene
A **Scene** is a specific location the player can visit. Each scene has a unique visual background, ambient audio, and a pool of available Choices.

- **Source of Truth:** `data/cenas.json`
- **State Management:** `runStore.currentScene` holds the data for the currently active scene.

### 2.3. Choice
A **Choice** is the primary unit of interaction and progression. It represents an observation or action the player can take within a Scene. Each Choice is unique and, once selected, is permanently unlocked for the player.

- **Source of Truth:** `data/escolhas.json`
- **State Management:** `playerStore.unlockedEscolhaIds` is an array that stores the IDs of every choice the player has ever made.

## 3. The Lifecycle of a Run

A run follows a strict, state-driven lifecycle managed by the `runOrchestrator` and its associated State Machines.

**Step 1: Initialization**
- The run begins, triggered by `runStore.startNewGameOrRun()`.
- The `runStartMachine` is initiated.
- It fetches the appropriate starting sequence from `inicios.json` based on the current `playerStore.runCount`.
- The initial scene is displayed, and the introductory narration is played.

**Step 2: Awaiting Initial Action**
- The player is presented with a single starting action (e.g., "Explore the library").
- When the player executes this action, the game transitions to the `EXPLORING` phase.

**Step 3: Exploration & Choice**
- The player is transported to a random, unvisited Scene.
- The system fetches all available, not-yet-unlocked **Choices** for that Scene from `escolhas.json`.
- The player selects one of the available Choices.

**Step 4: Consequence & Progression**
- The ID of the selected Choice is permanently added to `playerStore.unlockedEscolhaIds`.
- A consequence message (`msg_antes`) is displayed to the player.
- **This is the key progression event.** Unlocking this Choice ID may now meet the requirements for unlocking new content (notes, messages, gallery items, etc.) via the `contentStore`'s reactive getters.

**Step 5: Travel**
- After the consequence, the current Scene is marked as "visited" for the current run.
- The player is presented with up to two **Travel Options** to new, unvisited Scenes.
- The player chooses a new Scene, and the cycle returns to **Step 3**.

**Step 6: Run Conclusion**
- A run concludes when there are no more valid Travel Options. This occurs if:
    a. All Scenes have been visited in the current run.
    b. The player has unlocked every single Choice available in the game.
- The `handleTransitionToEnding` function is called. It loads the appropriate ending from `finais.json` and presents the final narration for the run.
- The player is then prompted to begin the next run.
