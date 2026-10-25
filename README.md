# SmartCode Studio - Interactive Modern IDE & Learning Platform

A modern web-based IDE and interactive coding platform powered by Monaco Editor (the editor core behind Visual Studio Code), featuring real-time in-editor diagnostics, smart indentation, multi-language execution (Python, SQL, JavaScript), and an integrated learning track curriculum.

---

## 🌟 Baseline IDE Features (Implemented)

1. **Syntax Highlighting & Language Detection**:
   - Token coloring for **Python**, **SQL**, and **JavaScript**.
   - Language selector with instant model syntax reconfiguration.
   - Multiple modern themes: **VS Dark+**, **Light**, **High Contrast**, and **Cyberpunk Neon**.

2. **Smart Indentation & Formatting**:
   - Auto-indentation following language idioms (e.g., 4-space auto-indent after `:` in Python).
   - Auto-closing parentheses `()`, brackets `[]`, and quotes `""` / `''`.
   - Document formatting engine accessible via `Shift + Alt + F` or the **Format** button.

3. **Auto-completion & IntelliSense**:
   - Keyword suggestions, standard library completions (`print`, `len`, `range`, `SELECT`, `WHERE`, `GROUP BY`, `map`, `filter`).
   - Function parameter tooltips and documentation snippets.
   - Built-in boilerplate templates (functions, list comprehensions, if-else blocks).

4. **Line Numbering & Visual Markers**:
   - Active line highlighting, line numbers, and indentation guides.
   - Code folding blocks for functions, loops, and classes.
   - Minimap on the right margin and status bar tracking cursor line/column in real-time.

5. **In-Editor Diagnostics & Linting**:
   - Real-time syntax and structural error catching on keypress.
   - Unmatched brackets and unclosed parentheses detection.
   - Python-specific linting: missing colons (`:`), indentation mismatch errors, inconsistent tabs/spaces, and unused variables.
   - Visual red/yellow inline squiggles and margin icons via Monaco `setModelMarkers`.
   - Dedicated **Problems / Linting** panel showing severity, line numbers, and click-to-navigate cursor jumping.

---

## 🎓 Included Learning Platform Features

- **Guided Learning vs Sandbox Playground**:
  - **Guided Learning Mode**: Split-view showing interactive instructions, theory, starter code, hints, and test assertions.
  - **Sandbox Playground Mode**: Full-screen coding workspace for unrestricted development and experimentation.
- **Interactive Multi-Language Tracks**:
  - **Python Track**: Variables & Expressions, Conditionals & Smart Indentation, List Comprehensions & Data Structures.
  - **JavaScript Track**: Modern ES6 Variables, Array Transformations (`map`, `filter`).
  - **SQL Track**: Basic Queries, Filtering, Aggregations & Grouping.
- **In-Browser Execution & Test Runner**:
  - In-browser code runner capturing stdout/stderr with execution timing.
  - **AlaSQL In-Memory Relational Engine**: Runs actual SQL queries against pre-seeded tables (`employees`, `departments`) and renders output in the **SQL Table Visualizer**.
  - **Automated Test Validation**: "Submit" button runs assertion checks, awards **XP**, marks lessons complete with green checkmarks, and updates user progress.
- **Interactive Quiz Challenges**:
  - Multiple-choice daily coding questions with immediate explanation feedback and bonus XP.

---

## 🚀 Running Locally

The IDE is served via Python's built-in HTTP server:

```bash
python -m http.server 8080
```

Open your browser at:
**[http://localhost:8080](http://localhost:8080)**

---

## 🧪 Automated Test Suite

To run the automated verification test suite:

```bash
python test_smartcode.py
```
