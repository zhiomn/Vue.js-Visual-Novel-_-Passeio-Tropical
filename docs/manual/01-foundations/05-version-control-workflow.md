# 1.5 Version Control Workflow (Git & GitHub)

To ensure project stability, maintain a clear history, and allow for safe experimentation, this project adheres to a strict Git-based feature branching workflow hosted on GitHub. The `main` branch is the single source of truth and must always be in a stable, working state.

---

### One-Time Setup: GitHub Authentication

**IMPORTANT:** GitHub no longer accepts account passwords for command-line operations. You **must** use a **Personal Access Token (PAT)**.

1.  **Generate a PAT:** Create a new token on the GitHub website: [Settings -> Developer settings -> Personal access tokens -> Tokens (classic)](https://github.com/settings/tokens).
2.  **Scopes:** When creating the token, grant it the full **`repo`** scope. This allows it to manage your private repositories.
3.  **Save the Token:** Copy the token and save it in a secure password manager. **You will only see it once.**
4.  **Authentication:** When the command line asks for your `Password`, **paste the Personal Access Token**, not your account password.

---

### Core Principles

1.  **`main` is Sacred:** No direct development occurs on the `main` branch. All new features or fixes are developed in separate branches.
2.  **Branches for Everything:** Every distinct task (e.g., "Implement settings UI", "Fix narration bug") must be done in a dedicated feature branch.
3.  **Clear Naming:** Branch names must be descriptive and follow a convention:
    -   New Features: `feature/short-description` (e.g., `feature/revamp-settings-app`)
    -   Bug Fixes: `fix/short-description` (e.g., `fix/gallery-unlock-logic`)
4.  **Atomic Commits:** Each command or logical group of commands from the AI should result in a single, well-described commit on the feature branch.
5.  **Push Early, Push Often:** The feature branch should be pushed to GitHub as soon as it's created to ensure it's backed up and visible.
6.  **Merge on Approval:** A feature branch is only merged into `main` after a successful review and an explicit command from the human collaborator.

---

### The Standard Workflow Cycle

1.  **Initiation (Human):** The human collaborator requests a new feature or fix.
    -   *Example Prompt:* "Let's work on the settings app. Please provide the commands to create and push a new branch for this."

2.  **Branching & Pushing (AI):** The AI provides the Git commands to create, switch to, and push the new feature branch to GitHub.
    -   *Example Command:*
        ```bash
        git checkout -b feature/revamp-settings-app
        git push -u origin feature/revamp-settings-app
        ```

3.  **Development (AI & Human):**
    -   The AI provides code modification commands (`cat > ...`).
    -   After a successful command, the AI provides the Git commands to commit and push the changes to the feature branch on GitHub.
    -   *Example Commit & Push Command:*
        ```bash
        git add .
        git commit -m "feat: Create custom slider component"
        git push
        ```

4.  **Review (Human):** Once the feature is complete on the branch, the human collaborator tests and reviews the changes (either locally or via the GitHub interface).

5.  **Merging (AI):** Upon approval, the AI provides the commands to merge the feature branch into `main` and push the updated `main` branch to GitHub.
    -   *Example Merge Command:*
        ```bash
        git checkout main
        git pull origin main
        git merge --no-ff feature/revamp-settings-app
        git push origin main
        ```

6.  **Cleanup (AI):** After a successful merge, the AI provides the command to delete the local and remote feature branch.
    -   *Example Cleanup Command:*
        ```bash
        git branch -d feature/revamp-settings-app
        git push origin --delete feature/revamp-settings-app
        ```
