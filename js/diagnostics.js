/**
 * SmartCode Studio - Real-time In-Editor Diagnostics & Linting Engine
 * Catches syntax errors, unmatched brackets, missing colons, indentation issues,
 * and unused variables in real-time before code execution.
 */

class DiagnosticsEngine {
  constructor() {
    this.markers = [];
    this.debounceTimer = null;
    this.listeners = [];
  }

  onDiagnosticsChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.markers));
  }

  /**
   * Run real-time linting on code buffer
   * @param {string} code
   * @param {string} language
   * @param {object} editor (Monaco editor instance)
   */
  lint(code, language, editor) {
    if (!editor || !window.monaco) return;
    const model = editor.getModel();
    if (!model) return;

    const markers = [];

    // 1. Universal Bracket / Parentheses / Quote Matcher
    this.lintBracketsAndQuotes(code, markers);

    // 2. Language-Specific Linters
    if (language === 'python') {
      this.lintPython(code, markers);
    } else if (language === 'javascript') {
      this.lintJavaScript(code, markers);
    } else if (language === 'sql') {
      this.lintSQL(code, markers);
    }

    this.markers = markers;

    // Apply markers directly to Monaco Editor (renders inline squiggles and margin markers!)
    window.monaco.editor.setModelMarkers(model, "smartcode-linter", markers);

    // Update Problems panel & UI counters
    this.updateProblemsPanel(markers, editor);
    this.notifyListeners();
  }

  /**
   * Bracket, brace and quote balance checker
   */
  lintBracketsAndQuotes(code, markers) {
    const lines = code.split("\n");
    const stack = [];
    const pairs = { ')': '(', ']': '[', '}': '{' };
    const opening = new Set(['(', '[', '{']);

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      // Skip commented lines
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('--')) {
        continue;
      }

      let inString = false;
      let quoteChar = null;

      for (let colIdx = 0; colIdx < line.length; colIdx++) {
        const char = line[colIdx];

        // Handle string literals escaping
        if ((char === '"' || char === "'") && (colIdx === 0 || line[colIdx - 1] !== '\\')) {
          if (!inString) {
            inString = true;
            quoteChar = char;
          } else if (quoteChar === char) {
            inString = false;
            quoteChar = null;
          }
          continue;
        }

        if (inString) continue;

        if (opening.has(char)) {
          stack.push({ char, line: lineIdx + 1, col: colIdx + 1 });
        } else if (pairs[char]) {
          if (stack.length === 0) {
            markers.push({
              severity: window.monaco.MarkerSeverity.Error,
              message: `Syntax Error: Unmatched closing bracket '${char}'`,
              startLineNumber: lineIdx + 1,
              startColumn: colIdx + 1,
              endLineNumber: lineIdx + 1,
              endColumn: colIdx + 2,
              source: "SmartCode Linter"
            });
          } else {
            const last = stack.pop();
            if (last.char !== pairs[char]) {
              markers.push({
                severity: window.monaco.MarkerSeverity.Error,
                message: `Mismatched brackets: Expected closing '${pairs[char]}' but found '${char}'`,
                startLineNumber: lineIdx + 1,
                startColumn: colIdx + 1,
                endLineNumber: lineIdx + 1,
                endColumn: colIdx + 2,
                source: "SmartCode Linter"
              });
            }
          }
        }
      }
    }

    // Any unclosed brackets left on stack
    while (stack.length > 0) {
      const unclosed = stack.pop();
      markers.push({
        severity: window.monaco.MarkerSeverity.Error,
        message: `Syntax Error: Unclosed bracket '${unclosed.char}' opened here`,
        startLineNumber: unclosed.line,
        startColumn: unclosed.col,
        endLineNumber: unclosed.line,
        endColumn: unclosed.col + 1,
        source: "SmartCode Linter"
      });
    }
  }

  /**
   * Python-specific linter: indentation, missing colons, unclosed strings
   */
  lintPython(code, markers) {
    const lines = code.split("\n");
    const blockStarters = [
      /\bdef\s+[a-zA-Z_]\w*\s*\(.*\)\s*$/,
      /\bclass\s+[a-zA-Z_]\w*\s*(?:\(.*\))?\s*$/,
      /\bif\s+.*$/,
      /\belif\s+.*$/,
      /\belse\s*$/,
      /\bfor\s+.*$/,
      /\bwhile\s+.*$/,
      /\btry\s*$/,
      /\bexcept(?:\s+.*)?$/,
      /\bfinally\s*$/,
      /\bwith\s+.*$/
    ];

    let expectedIndentAfterLine = null;

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // Skip blank or pure comment lines
      if (trimmed === "" || trimmed.startsWith("#")) {
        continue;
      }

      const currentIndent = rawLine.search(/\S/);

      // Check if previous line required an indented block
      if (expectedIndentAfterLine !== null) {
        if (currentIndent <= expectedIndentAfterLine.indent) {
          markers.push({
            severity: window.monaco.MarkerSeverity.Error,
            message: `IndentationError: Expected an indented block after statement at line ${expectedIndentAfterLine.line}`,
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: Math.max(currentIndent + 1, 2),
            source: "Python Linter"
          });
        }
        expectedIndentAfterLine = null;
      }

      // Check for missing colons on statement headers
      for (const pattern of blockStarters) {
        if (pattern.test(trimmed)) {
          if (!trimmed.endsWith(":")) {
            markers.push({
              severity: window.monaco.MarkerSeverity.Error,
              message: `SyntaxError: Expected ':' at the end of statement`,
              startLineNumber: lineNum,
              startColumn: rawLine.length,
              endLineNumber: lineNum,
              endColumn: rawLine.length + 1,
              source: "Python Linter"
            });
          } else {
            expectedIndentAfterLine = { line: lineNum, indent: currentIndent };
          }
          break;
        }
      }

      // Check for mixing tabs and spaces
      if (rawLine.includes("\t") && rawLine.includes("  ")) {
        markers.push({
          severity: window.monaco.MarkerSeverity.Warning,
          message: "TabError: Inconsistent use of tabs and spaces in indentation",
          startLineNumber: lineNum,
          startColumn: 1,
          endLineNumber: lineNum,
          endColumn: 4,
          source: "Python Linter"
        });
      }

      // Basic unused variable detection (e.g., assignment without subsequent usage in small script)
      const varAssignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*[^=]/);
      if (varAssignMatch && !trimmed.startsWith("self.")) {
        const varName = varAssignMatch[1];
        // Check if variable is referenced anywhere else in the code
        const count = (code.match(new RegExp(`\\b${varName}\\b`, "g")) || []).length;
        if (count === 1) {
          const col = rawLine.indexOf(varName) + 1;
          markers.push({
            severity: window.monaco.MarkerSeverity.Warning,
            message: `Lint Warning: Local variable '${varName}' is assigned but never used`,
            startLineNumber: lineNum,
            startColumn: col,
            endLineNumber: lineNum,
            endColumn: col + varName.length,
            source: "Python Linter"
          });
        }
      }
    }
  }

  /**
   * JavaScript-specific linter
   */
  lintJavaScript(code, markers) {
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed || trimmed.startsWith("//")) continue;

      // Check for const reassignment or uninitialized const
      if (/^const\s+[a-zA-Z_$][\w$]*\s*;?$/.test(trimmed)) {
        markers.push({
          severity: window.monaco.MarkerSeverity.Error,
          message: "SyntaxError: Missing initializer in const declaration",
          startLineNumber: lineNum,
          startColumn: 1,
          endLineNumber: lineNum,
          endColumn: rawLine.length + 1,
          source: "JavaScript Linter"
        });
      }

      // Warn on double equals vs triple equals
      if (/\s==\s/.test(rawLine) && !rawLine.includes("===")) {
        const col = rawLine.indexOf("==") + 1;
        markers.push({
          severity: window.monaco.MarkerSeverity.Warning,
          message: "Style Suggestion: Use '===' instead of loose equality '=='",
          startLineNumber: lineNum,
          startColumn: col,
          endLineNumber: lineNum,
          endColumn: col + 2,
          source: "JavaScript Linter"
        });
      }
    }
  }

  /**
   * SQL-specific linter
   */
  lintSQL(code, markers) {
    const lines = code.split("\n");
    const upperCode = code.toUpperCase();

    // Check if SELECT statement is missing FROM clause when table fields are queried
    if (upperCode.includes("SELECT") && !upperCode.includes("FROM") && !upperCode.includes("SELECT 1") && !upperCode.includes("SELECT NOW()")) {
      markers.push({
        severity: window.monaco.MarkerSeverity.Warning,
        message: "SQL Warning: SELECT statement usually requires a FROM <table> clause",
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 7,
        source: "SQL Linter"
      });
    }

    // Check for unclosed single quotes in SQL queries
    let singleQuotes = (code.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      markers.push({
        severity: window.monaco.MarkerSeverity.Error,
        message: "SyntaxError: Unterminated string literal (unmatched single quote ')",
        startLineNumber: lines.length,
        startColumn: 1,
        endLineNumber: lines.length,
        endColumn: lines[lines.length - 1].length + 1,
        source: "SQL Linter"
      });
    }
  }

  /**
   * Populate the Problems tab in the bottom panel
   */
  updateProblemsPanel(markers, editor) {
    const tbody = document.getElementById("problems-tbody");
    const countBadge = document.getElementById("diagnostics-count-badge");
    const errVal = document.getElementById("status-error-val");
    const warnVal = document.getElementById("status-warn-val");
    const editorErrBadge = document.getElementById("error-count");
    const editorWarnBadge = document.getElementById("warning-count");

    const errors = markers.filter(m => m.severity === window.monaco.MarkerSeverity.Error);
    const warnings = markers.filter(m => m.severity === window.monaco.MarkerSeverity.Warning);

    if (countBadge) countBadge.textContent = markers.length;
    if (errVal) errVal.textContent = errors.length;
    if (warnVal) warnVal.textContent = warnings.length;
    if (editorErrBadge) editorErrBadge.textContent = errors.length;
    if (editorWarnBadge) editorWarnBadge.textContent = warnings.length;

    if (!tbody) return;

    if (markers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="no-problems">
            <i class="fa-solid fa-circle-check"></i> No syntax errors or lint warnings detected.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = "";
    markers.forEach(marker => {
      const isErr = marker.severity === window.monaco.MarkerSeverity.Error;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <span class="diag-severity ${isErr ? 'error' : 'warning'}">
            <i class="fa-solid ${isErr ? 'fa-circle-xmark' : 'fa-triangle-exclamation'}"></i>
            ${isErr ? 'Error' : 'Warning'}
          </span>
        </td>
        <td class="diag-line">Ln ${marker.startLineNumber}, Col ${marker.startColumn}</td>
        <td>${marker.message}</td>
        <td style="color: var(--text-muted);">${marker.source || 'Linter'}</td>
      `;

      // Jump to error line on click
      tr.addEventListener("click", () => {
        editor.revealLineInCenter(marker.startLineNumber);
        editor.setPosition({ lineNumber: marker.startLineNumber, column: marker.startColumn });
        editor.focus();
      });

      tbody.appendChild(tr);
    });
  }
}

// Global Diagnostics Instance
window.SmartCodeDiagnostics = new DiagnosticsEngine();
