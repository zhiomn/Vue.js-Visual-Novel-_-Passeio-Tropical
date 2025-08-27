# 1.4 CLI Command Best Practices

The single-line, executable terminal command is the primary interface for collaboration. Its format has been refined to maximize robustness and clarity, prioritizing what has proven to work reliably in practice.

---

## 1. The Sole Standard: `cat` with "Here Document"

To guarantee transparency and robustness against the most common collaboration issues, the **only** permitted method for file delivery (both overwriting and appending) is the `cat` command combined with a "here document".

**This is a non-negotiable directive.**

### 1.1 Overwriting Files (`>`)

Use a single greater-than sign (`>`) to completely replace the contents of a file.

**Structure:**
- ```bash
# Overwrites the entire file with the new content.
cat > [FILE_PATH] << 'EOF'
[Full and complete content of the file]
EOF```

### 1.2 Appending to Files (`>>`)

Use a double greater-than sign (`>>`) to add content to the end of an existing file without deleting its current content.

**Structure:**
- ```bash
# Appends the new content to the end of the file.
cat >> [FILE_PATH] << 'EOF'
[New content to be added]

2. The Critical Distinction: > vs. >>
Understanding the difference between these two operators is the most critical part of this workflow. Using the wrong one will lead to data loss.
> (Overwrite): A destructive action. Use only when your intent is to replace the file entirely.
>> (Append): A non-destructive action. Use when your intent is to add to the file.
Always verify the operator matches the task's intent.

3. Deprecated Methods (Forbidden)
The base64 Experiment
Status: FORBIDDEN.
Reasoning: An experiment was conducted to use base64 encoding to prevent copy-paste errors. In practice, this method proved to be more fragile, introducing its own encoding/decoding errors that resulted in corrupted files and broken builds. It also violates our Cognitive Clarity pillar by obscuring the content being delivered. The theoretical robustness was outweighed by the practical friction it created.
Conclusion: The transparency and proven reliability of the cat command make it our sole standard. No other file delivery methods will be used.
