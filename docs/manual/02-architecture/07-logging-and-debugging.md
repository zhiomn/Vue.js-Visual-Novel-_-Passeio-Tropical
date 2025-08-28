# 2.7 Logging & Debugging

This project utilizes a structured and detailed logging system to provide clear insights into the application's runtime behavior. This is a critical tool for debugging and for understanding the flow of state and logic.

---

### 1. The Logger Factory

-   **Location:** `/src/utils/loggers/loggerFactory.js`
-   **Philosophy:** All loggers in the project are created by this central factory. This ensures that all log messages share a consistent format and can be globally enabled or disabled via the `debugMode` flag in `config.json`.

### 2. How to Read the Logs

Each log message in the browser's developer console is designed to be informative:

-   **Prefix Tag:** Each message begins with a colored tag (e.g., `RunOrchestrator`, `UIManager`) that clearly identifies the system or module that produced the message.
-   **Message:** The main content of the log entry.
-   **Caller Info:** Below the message, a line in gray italics shows the exact file, line number, and function name that generated the log. This is invaluable for tracing the execution flow.
-   **Data Payload:** If the log includes an object or data, it is displayed as an interactive object at the end of the message.

### 3. Key Loggers

-   **`RunOrchestrator` (Purple):** Logs high-level game flow events, state machine transitions, and the orchestration of actions.
-   **`UIManager` (Cyan):** Logs events related to the display layer, such as input locks, animations, and component visibility changes.
-   **`PlayerStore` (Orange):** Logs changes to the persistent player state.
-   **And others...** Each major module has its own logger.

### 4. Special Log Functions

-   `.group(title)` / `.groupEnd()`: These are used to group a series of related log messages under a collapsible title, reducing clutter in the console.
-   `.logState(storeName, stateObject)`: A special function that prints a snapshot of a store's state in a clean, readable table format. This is our primary tool for debugging state-related issues.
