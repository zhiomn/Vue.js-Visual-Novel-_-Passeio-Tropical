# 1.4 CLI Command Best Practices

This document defines the official, robust protocol for file delivery in this project. It has been refined to work reliably within the constraints of our AI-Human chat interface.

**The core principle is the strict separation of Command and Content.**

---

### The "Command-Content Separation" Protocol

All file creation and modification commands **must** be delivered in a two-part format: **The Command Block** and **The Content Block**. This is a non-negotiable directive to prevent rendering errors from the chat interface and ensure perfect file integrity.

#### Part 1: The Command

The AI will provide a simple, incomplete `cat` command using a "here document" with a **quoted delimiter (`'EOF'`)**. The quoted delimiter is critical as it prevents the shell from interpreting special characters (like `!` and `$`) within the content.

-   **To Overwrite a file:** `cat > [FILE_PATH] << 'EOF'`
-   **To Append to a file:** `cat >> [FILE_PATH] << 'EOF'`

#### Part 2: The Content

Immediately following the command, the AI will provide the full, clean file content inside a separate, clearly marked code block.

#### Part 3: The Execution (Human Action)

The human collaborator must follow these steps precisely:

1.  Copy the **Command** from Part 1 and paste it into the terminal. Press **Enter**. The terminal will now be waiting for input, often showing a `>` prompt.
2.  Copy the entire **Content** from Part 2 and paste it into the terminal.
3.  Press **Enter** one last time to ensure the last line is registered.
4.  On a new line, type `EOF` exactly as it appears in the command and press **Enter**. This finalizes the command and writes the file.

---

### Why this Protocol is the Final Standard

This protocol is the most robust solution because it solves both potential points of failure simultaneously:

1.  **It solves the Shell Interpretation problem:** Using `<< 'EOF'` (with quotes) guarantees that the terminal treats the content as a literal string.
2.  **It solves the Interface Rendering problem:** Separating the content into its own block prevents the chat UI from breaking the structure of the initial command.

This is our standard for all future file modifications.
