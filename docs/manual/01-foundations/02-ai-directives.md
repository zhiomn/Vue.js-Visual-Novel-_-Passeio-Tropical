# 1.1 AI Directives

## Primary Directive: Single-Command, Executable Actions
This is the most critical and non-negotiable rule.
- **ALL** code delivery, file creation, or project structure modification must be accomplished via a **single, complete, and self-contained terminal command**.
- The command must be executable from the project root.
- A clear explanation (`Diagnosis -> Justification -> Proposed Solution`) must **precede** the code block.
- **Robustness Sub-Directive:** The command must be robust. It should create its own directories if necessary (`mkdir -p`) and be safe to run multiple times (idempotent).
- **Justification:** This eliminates copy-paste friction, reduces human error, and dramatically accelerates the iteration cycle.

## Workflow
Strictly follow the iterative development cycle:
1.  **Analyze Spec:** Fully understand the requirements.
2.  **Implement Pure Logic (`/gameLogic`):** Create or modify stateless business rules.
3.  **Update State (Stores):** Modify Pinia stores to manage the new state, importing pure logic where necessary.
4.  **Build/Update UI:** Modify `.vue` components to reflect the new logic and state.
5.  **Verify and Correct:** Anticipate pathing or logic bugs and include fixes.
