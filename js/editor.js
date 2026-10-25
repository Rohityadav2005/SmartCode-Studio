/**
 * SmartCode Studio - Monaco Editor Integration & IntelliSense Service
 * Configures syntax coloring, smart indentation, bracket completion,
 * IntelliSense autocompletions with parameter tooltips, and themes.
 */

class EditorManager {
  constructor() {
    this.editor = null;
    this.currentLanguage = "python";
    this.isReady = false;
    this.readyCallbacks = [];
  }

  onReady(callback) {
    if (this.isReady) {
      callback(this.editor);
    } else {
      this.readyCallbacks.push(callback);
    }
  }

  /**
   * Initialize Monaco via AMD loader
   */
  init() {
    // Configure Monaco require path
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
      }
    });

    require(["vs/editor/editor.main"], () => {
      this.setupCustomThemes();
      this.registerLanguageFeatures();
      this.createEditorInstance();

      this.isReady = true;
      this.readyCallbacks.forEach(cb => cb(this.editor));
    });
  }

  /**
   * Setup themes including Cyberpunk Neon
   */
  setupCustomThemes() {
    monaco.editor.defineTheme("cyberpunk", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "ff007f", fontStyle: "bold" },
        { token: "string", foreground: "00ffcc" },
        { token: "number", foreground: "f1fa8c" },
        { token: "identifier", foreground: "f8f8f2" },
        { token: "type", foreground: "8be9fd" },
        { token: "delimiter", foreground: "00ffcc" }
      ],
      colors: {
        "editor.background": "#0a0b10",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#161824",
        "editorLineNumber.foreground": "#44475a",
        "editorLineNumber.activeForeground": "#00ffcc",
        "editorIndentGuide.background": "#1e2133",
        "editorIndentGuide.activeBackground": "#00ffcc",
        "editorCursor.foreground": "#00ffcc"
      }
    });
  }

  /**
   * Register rich Auto-completion & IntelliSense with parameter hints
   */
  registerLanguageFeatures() {
    // 1. Python IntelliSense & Keyword Tooltips
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          // Built-in functions with doc tooltips
          {
            label: "print",
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "print(*objects, sep=' ', end='\\n', file=sys.stdout, flush=False)\n\nPrints the values to a stream, or to sys.stdout by default.",
            insertText: "print(${1:value})",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "len",
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "len(s) -> int\n\nReturn the number of items in a container (string, list, tuple, dict).",
            insertText: "len(${1:container})",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "range",
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "range(stop) or range(start, stop[, step])\n\nGenerates an immutable sequence of numbers.",
            insertText: "range(${1:start}, ${2:stop})",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          // Snippets for fast learning
          {
            label: "def function",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Define a reusable Python function with documentation.",
            insertText: "def ${1:function_name}(${2:params}):\n    \"\"\"${3:Docstring}\"\"\"\n    ${4:pass}\n",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "if-else block",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Conditional branch statement.",
            insertText: "if ${1:condition}:\n    ${2:pass}\nelse:\n    ${3:pass}\n",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "for loop",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Iterate over an iterable sequence.",
            insertText: "for ${1:item} in ${2:iterable}:\n    ${3:pass}\n",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "list comprehension",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Concise syntax to transform sequences.",
            insertText: "[${1:expr} for ${2:x} in ${3:iterable} if ${4:condition}]",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          }
        ];

        return { suggestions };
      }
    });

    // 2. SQL IntelliSense & Keyword Tooltips
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          {
            label: "SELECT",
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: "SELECT column1, column2 FROM table_name\n\nExtracts data from a database table.",
            insertText: "SELECT ${1:*} FROM ${2:employees}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "WHERE",
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: "WHERE condition\n\nFilters records that fulfill a specified criteria.",
            insertText: "WHERE ${1:department} = '${2:Engineering}'",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "GROUP BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: "GROUP BY column_name\n\nGroups rows that have the same values into summary rows.",
            insertText: "GROUP BY ${1:department}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: "ORDER BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: "ORDER BY column ASC|DESC\n\nSorts the result set in ascending or descending order.",
            insertText: "ORDER BY ${1:salary} DESC",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          // Database schema suggestions
          {
            label: "employees",
            kind: monaco.languages.CompletionItemKind.Struct,
            documentation: "Table: employees\nColumns: id, name, department, salary, hire_year",
            insertText: "employees",
            range: range
          },
          {
            label: "departments",
            kind: monaco.languages.CompletionItemKind.Struct,
            documentation: "Table: departments\nColumns: id, name, budget",
            insertText: "departments",
            range: range
          }
        ];

        return { suggestions };
      }
    });

    // 3. Document Formatting Providers (Shift + Alt + F)
    monaco.languages.registerDocumentFormattingEditProvider("python", {
      provideDocumentFormattingEdits: (model) => {
        // Normalize 4-space indentation and clean trailing spaces
        const text = model.getValue();
        const formatted = this.formatPythonCode(text);
        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      }
    });

    monaco.languages.registerDocumentFormattingEditProvider("sql", {
      provideDocumentFormattingEdits: (model) => {
        const text = model.getValue();
        const formatted = this.formatSQLCode(text);
        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      }
    });
  }

  /**
   * Create the Monaco instance with baseline IDE expectations
   */
  createEditorInstance() {
    const container = document.getElementById("monaco-editor-container");
    container.innerHTML = ""; // Remove loading placeholder

    this.editor = monaco.editor.create(container, {
      value: CURRICULUM.python[0].starterCode,
      language: "python",
      theme: "vs-dark",

      // Line Numbering & Visual Markers
      lineNumbers: "on",
      renderLineHighlight: "all",
      folding: true,
      foldingStrategy: "indentation",
      showFoldingControls: "always",
      glyphMargin: true,

      // Smart Indentation & Formatting
      autoIndent: "full",
      tabSize: 4,
      insertSpaces: true,
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      formatOnPaste: true,
      formatOnType: true,

      // Auto-completion & IntelliSense
      quickSuggestions: { other: true, comments: false, strings: true },
      parameterHints: { enabled: true },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on",
      hover: { enabled: true, delay: 200 },

      // Visuals & Typography
      fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
      fontSize: 14,
      fontLigatures: true,
      minimap: { enabled: true, maxColumn: 80 },
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 12, bottom: 12 }
    });

    // Cursor position tracking in status bar
    this.editor.onDidChangeCursorPosition(e => {
      const cursorElem = document.getElementById("status-cursor");
      if (cursorElem) {
        cursorElem.textContent = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
      }
    });

    // Real-time diagnostics linting on change
    this.editor.onDidChangeModelContent(() => {
      if (window.SmartCodeDiagnostics) {
        clearTimeout(this.lintDebounce);
        this.lintDebounce = setTimeout(() => {
          window.SmartCodeDiagnostics.lint(this.editor.getValue(), this.currentLanguage, this.editor);
        }, 250);
      }
    });

    // Run initial lint
    setTimeout(() => {
      if (window.SmartCodeDiagnostics) {
        window.SmartCodeDiagnostics.lint(this.editor.getValue(), this.currentLanguage, this.editor);
      }
    }, 400);
  }

  /**
   * Set editor code and switch language
   */
  setLanguageAndCode(language, code) {
    this.currentLanguage = language;
    if (this.editor) {
      const model = this.editor.getModel();
      monaco.editor.setModelLanguage(model, language);
      this.editor.setValue(code);

      // Adjust tab sizing (Python = 4, JS = 2, SQL = 2 or 4)
      const tabSize = language === "python" ? 4 : 2;
      model.updateOptions({ tabSize, insertSpaces: true });
      const indentElem = document.getElementById("status-indent");
      if (indentElem) indentElem.textContent = `Spaces: ${tabSize}`;

      // Update status bar language
      const langElem = document.getElementById("status-lang-display");
      if (langElem) {
        langElem.textContent = language === "python" ? "Python 3" : (language === "javascript" ? "JavaScript ES2023" : "ANSI SQL");
      }

      // Re-run lint
      if (window.SmartCodeDiagnostics) {
        window.SmartCodeDiagnostics.lint(code, language, this.editor);
      }
    }
  }

  setTheme(themeName) {
    if (window.monaco) {
      monaco.editor.setTheme(themeName);
    }
  }

  formatCode() {
    if (this.editor) {
      this.editor.getAction("editor.action.formatDocument").run();
    }
  }

  formatPythonCode(code) {
    // Clean trailing whitespace and enforce clean indentation
    return code
      .split("\n")
      .map(line => line.replace(/\s+$/, ""))
      .join("\n");
  }

  formatSQLCode(code) {
    const keywords = ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", "JOIN", "LEFT JOIN", "INNER JOIN"];
    let formatted = code;
    keywords.forEach(kw => {
      const reg = new RegExp(`\\b${kw}\\b`, "gi");
      formatted = formatted.replace(reg, kw);
    });
    return formatted;
  }
}

// Global Editor Manager
window.SmartCodeEditor = new EditorManager();
