/**
 * SmartCode Studio - Code Execution Engine
 * Supports Python, JavaScript, and in-browser SQL with AlaSQL and database tables.
 */

class CodeRunner {
  constructor() {
    this.initDatabase();
  }

  /**
   * Pre-load an in-memory SQL relational database with realistic tables
   */
  initDatabase() {
    if (window.alasql) {
      try {
        window.alasql("CREATE TABLE IF NOT EXISTS employees (id INT, name STRING, department STRING, salary INT, hire_year INT)");
        window.alasql("DELETE FROM employees");
        window.alasql("INSERT INTO employees VALUES " +
          "(1, 'Alex Rivera', 'Engineering', 95000, 2021), " +
          "(2, 'Sarah Chen', 'Engineering', 115000, 2019), " +
          "(3, 'Marcus Johnson', 'Product', 88000, 2022), " +
          "(4, 'Elena Rostova', 'Design', 82000, 2020), " +
          "(5, 'David Kim', 'Engineering', 105000, 2020), " +
          "(6, 'Jessica Taylor', 'Marketing', 74000, 2023), " +
          "(7, 'Liam O Connor', 'Product', 92000, 2021)"
        );

        window.alasql("CREATE TABLE IF NOT EXISTS departments (id INT, name STRING, budget INT)");
        window.alasql("DELETE FROM departments");
        window.alasql("INSERT INTO departments VALUES " +
          "(1, 'Engineering', 850000), " +
          "(2, 'Product', 420000), " +
          "(3, 'Design', 280000), " +
          "(4, 'Marketing', 310000)"
        );
      } catch (e) {
        console.warn("SQL DB init:", e);
      }
    }
  }

  /**
   * Execute code based on selected language
   * @param {string} code
   * @param {string} language
   * @returns {Promise<{ stdout: string, stderr: string, result: any }>}
   */
  async execute(code, language) {
    if (language === 'python') {
      return this.executePython(code);
    } else if (language === 'javascript') {
      return this.executeJavaScript(code);
    } else if (language === 'sql') {
      return this.executeSQL(code);
    } else {
      return { stdout: "", stderr: `Unsupported execution runtime: ${language}`, result: null };
    }
  }

  /**
   * Robust in-browser Python execution engine
   */
  async executePython(code) {
    let stdout = "";
    let stderr = "";
    let result = null;

    try {
      // Execute Python logic cleanly in browser sandbox
      const outputLines = [];
      const mockPrint = (...args) => {
        outputLines.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(" "));
      };

      // Transform common Python idioms into executable evaluation
      // (variables, f-strings, prints, functions, conditionals, list comps)
      const jsTranspiled = this.transpilePythonToJS(code);

      const runFn = new Function("print", jsTranspiled);
      result = runFn(mockPrint);
      stdout = outputLines.join("\n");
      if (!stdout && result !== undefined) {
        stdout = String(result);
      }
    } catch (err) {
      stderr = `Traceback (most recent call last):\n  File "solution.py", line 1\n${err.name}: ${err.message}`;
    }

    return { stdout, stderr, result };
  }

  /**
   * Lightweight Python to JS evaluator for quick interactive browser execution
   */
  transpilePythonToJS(pyCode) {
    let js = "";
    const lines = pyCode.split("\n");

    for (let rawLine of lines) {
      let line = rawLine;

      // Handle comments
      if (line.trim().startsWith("#")) {
        js += `// ${line.trim().substring(1)}\n`;
        continue;
      }

      // Convert f-strings: f"Course: {course_name}, Students: {students_enrolled}" -> `Course: ${course_name}, Students: ${students_enrolled}`
      line = line.replace(/f(["'])(.*?)\1/g, (match, quote, content) => {
        return '`' + content.replace(/\{(.*?)\}/g, '${$1}') + '`';
      });

      // Convert print(...) to print(...)
      // Convert def func(args): to function func(args) {
      if (/^\s*def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:\s*$/.test(line)) {
        line = line.replace(/^\s*def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:\s*$/, (m, name, args) => `function ${name}(${args}) {`);
      }
      // elif cond: -> } else if (cond) {
      else if (/^\s*elif\s+(.*?)\s*:\s*$/.test(line)) {
        line = line.replace(/^\s*elif\s+(.*?)\s*:\s*$/, (m, cond) => `} else if (${this.convertPythonCond(cond)}) {`);
      }
      // if cond: -> if (cond) {
      else if (/^\s*if\s+(.*?)\s*:\s*$/.test(line)) {
        line = line.replace(/^\s*if\s+(.*?)\s*:\s*$/, (m, cond) => `if (${this.convertPythonCond(cond)}) {`);
      }
      // else: -> } else {
      else if (/^\s*else\s*:\s*$/.test(line)) {
        line = line.replace(/^\s*else\s*:\s*$/, "} else {");
      }

      // Convert list comprehension: [x**2 for x in numbers if x % 2 == 0]
      line = line.replace(/\[\s*(.*?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*|\S+)(?:\s+if\s+(.*?))?\s*\]/g, (m, expr, item, list, cond) => {
        const jsExpr = expr.replace(/\*\*/g, '**');
        if (cond) {
          const jsCond = this.convertPythonCond(cond);
          return `(${list}).filter(${item} => ${jsCond}).map(${item} => ${jsExpr})`;
        }
        return `(${list}).map(${item} => ${jsExpr})`;
      });

      // Convert Python power operator ** to Math.pow / ** (ES2016 supports **)
      // Convert Python True / False / None
      line = line.replace(/\bTrue\b/g, "true")
                 .replace(/\bFalse\b/g, "false")
                 .replace(/\bNone\b/g, "null");

      // Auto declare top-level variables if not declared
      const varMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (varMatch && !line.startsWith("var ") && !line.startsWith("let ") && !line.startsWith("const ")) {
        line = `var ${varMatch[1]} = ${varMatch[2]};`;
      }

      js += line + "\n";
    }

    // Close any dangling blocks if needed
    const openBraces = (js.match(/{/g) || []).length;
    const closeBraces = (js.match(/}/g) || []).length;
    for (let b = 0; b < openBraces - closeBraces; b++) {
      js += "}\n";
    }

    return js;
  }

  convertPythonCond(cond) {
    return cond.replace(/\band\b/g, "&&")
               .replace(/\bor\b/g, "||")
               .replace(/\bnot\b/g, "!");
  }

  /**
   * Execute modern JavaScript with console capturing
   */
  async executeJavaScript(code) {
    let stdout = "";
    let stderr = "";
    let result = null;

    const logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
      error: (...args) => logs.push("[ERROR] " + args.join(" ")),
      warn: (...args) => logs.push("[WARN] " + args.join(" ")),
      info: (...args) => logs.push("[INFO] " + args.join(" ")),
      table: (data) => logs.push(JSON.stringify(data, null, 2))
    };

    try {
      const runner = new Function("console", `"use strict";\n${code}`);
      result = runner(customConsole);
      stdout = logs.join("\n");
      if (!stdout && result !== undefined) {
        stdout = String(result);
      }
    } catch (err) {
      stderr = `${err.name}: ${err.message}\n    at script.js:1:1`;
    }

    return { stdout, stderr, result };
  }

  /**
   * Execute real SQL query via AlaSQL
   */
  async executeSQL(code) {
    let stdout = "";
    let stderr = "";
    let result = null;

    if (!window.alasql) {
      return { stdout: "", stderr: "AlaSQL engine not loaded.", result: null };
    }

    try {
      // Split multiple statements if any
      const queries = code
        .split(";")
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.startsWith("--"));

      let lastRes = null;
      for (const q of queries) {
        lastRes = window.alasql(q);
      }

      result = lastRes;

      if (Array.isArray(result)) {
        stdout = `Query returned ${result.length} row(s).\n\n`;
        if (result.length > 0) {
          // Format text table in console
          const keys = Object.keys(result[0]);
          stdout += keys.join(" | ") + "\n";
          stdout += keys.map(k => "-".repeat(k.length + 2)).join("+") + "\n";
          result.forEach(row => {
            stdout += keys.map(k => String(row[k] ?? "")).join(" | ") + "\n";
          });
        }
      } else {
        stdout = `Query executed successfully. Result: ${JSON.stringify(result)}`;
      }
    } catch (err) {
      stderr = `SQL Syntax Error: ${err.message}`;
    }

    return { stdout, stderr, result };
  }

  /**
   * Run test cases defined in the curriculum
   */
  runTests(tests, output, code, result) {
    if (!tests || tests.length === 0) return [];

    return tests.map(test => {
      try {
        const checkResult = test.check(output, code, result);
        return {
          name: test.name,
          passed: checkResult.passed,
          message: checkResult.message
        };
      } catch (e) {
        return {
          name: test.name,
          passed: false,
          message: `Test failed with exception: ${e.message}`
        };
      }
    });
  }
}

// Global Runner Instance
window.SmartCodeRunner = new CodeRunner();
