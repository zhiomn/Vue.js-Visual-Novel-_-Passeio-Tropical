# 1.7 The `sed` Protocol: A Tool for Surgical Strikes

This document formalizes the introduction of a new, high-precision tool into our command-line interface: `sed` (Stream Editor). It serves as a tactical alternative to our standard `cat` protocol.

While `cat` acts as our robust "sledgehammer" for creating or completely overwriting files, `sed` is our "scalpel," designed for small, surgical edits on existing files. Understanding when to use each tool is critical for maintaining workflow efficiency and avoiding errors.

---

### Core Concept: The "Find and Replace" Robot

At its core, `sed` is an automated "find and replace" robot that we can command from the terminal. We provide it with a pattern to find in a file and an instruction on what to do when it finds it (e.g., delete the line, or replace a word).

### When to Use `sed` vs. `cat`

The decision to use `sed` over `cat` is based on the scope of the change:

-   **Use `sed` for:**
    -   Deleting a single, specific line of code.
    -   Replacing a specific word or value within a line (e.g., changing a color hex code).
    -   Commenting out a line by adding `//` or `#` to its beginning.

-   **Continue using `cat` for:**
    -   Creating any new file.
    -   Overwriting an entire file with significant changes.
    -   Any modification involving more than 2-3 distinct lines, where a full overwrite is clearer and more robust.

### Anatomy of Our `sed` Commands

Our primary use case is deleting lines. The command structure is as follows:

`sed -i '/pattern_to_find/d' path/to/file.js`

-   `sed`: The command to invoke the Stream Editor.
-   `-i`: The "in-place" flag. This critical instruction tells `sed` to modify the file directly.
-   `'...'`: The instruction block, containing the pattern and the action.
-   `/.../`: Delimiters that wrap our search pattern.
-   `pattern_to_find`: The exact text `sed` will look for. This can be a simple string or a regular expression.
-   `d`: The action to take. `d` stands for **delete the entire line** that matches the pattern.

### Case Study: Removing the Loading Wave

Our first use of this protocol was to remove the loading wave animation. This required two surgical strikes:

1.  **Removing the HTML Tag:**
    -   **File:** `src/components/ui/LoadingScreen.vue`
    -   **Line to Delete:** `<img src="@/assets/loading-wave.svg" class="loading-wave" ... />`
    -   **Command:** `sed -i '/<img src="@\/assets\/loading-wave.svg" class="loading-wave"/d' src/components/ui/LoadingScreen.vue`

2.  **Removing the CSS Rules:**
    -   **File:** `src/assets/ui/_loading.css`
    -   **Lines to Delete:** The block containing the animation rules.
    -   **Command:** `sed -i '/\/\* Animation for the SVG wave \*\//,$d' src/assets/ui/_loading.css` (This command finds the comment and deletes from that line to the end of the file).

### The Critical Caveat: The Fragility Principle

**`sed` is powerful but fragile.** Its effectiveness depends entirely on the `pattern_to_find` matching a line in the target file *exactly*.

If the source code changes even slightly (e.g., a prop is reordered, an extra space is added), the `sed` command will fail silently without applying the change.

**Directive:** The `cat` protocol remains our default for its absolute robustness. `sed` should only be proposed for minor, atomic changes where the target code is stable and unlikely to have been altered by other recent commands. The human collaborator must always verify that the `sed` command has successfully applied the intended change.
