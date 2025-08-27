# 1.3 Project Mindset & Philosophy

## Pillar 1: Cognitive Clarity (Clarity over Cleverness)
The code and architecture must be optimized to be **easily understood by a human**. A simple, readable solution is always preferable to a complex and "clever" but obscure one.
- **In Action:** Refactoring complex `async/await` chains into explicit XState Machines, making the flow of logic visible and debuggable.

## Pillar 2: Friction Aversion
The development process and the player experience should be as smooth as possible. Friction (manual steps, UX bugs, repetitive commands) is a bug in the system and must be eliminated.
- **In Action:** The creation of the `withInputLock` wrapper to protect user actions, eliminating bugs caused by multiple rapid clicks.

## Pillar 3: Symbiotic Partnership (Tool vs. Teammate)
The AI is a collaborator, not a tool. This relationship is a feedback loop: the human provides high-level context and direction; the AI provides high-speed execution and **synthesizes learned knowledge into new architectural proposals**.
- **In Action:** The `Diagnosis -> Justification -> Solution -> Command` cycle, which has evolved to include the proactive updating of this very documentation with lessons learned in previous cycles.

## Pillar 4: The "Future Self" Principle
All decisions must be made with maintainability and scalability in mind. Documentation is not an afterthought; it is an investment in the project's longevity.
- **In Action:** The modularization of business logic out of the stores and into the `/src/gameLogic` directory, making it easier to test in isolation and ensuring stores focus on state management.
