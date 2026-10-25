/**
 * SmartCode Studio - Curriculum & Interactive Learning Tracks
 * Contains rich multi-language pathways: Python, JavaScript, and SQL.
 */

const CURRICULUM = {
  python: [
    {
      id: "py-01",
      track: "python",
      category: "Python Basics",
      title: "1. Variables & Expressions",
      filename: "solution.py",
      instructions: `
        <p>In Python, variables are created when you assign a value to them using the assignment operator (<code>=</code>).</p>
        <h4>Syntax Rules</h4>
        <p>Variable names are case-sensitive and must start with a letter or an underscore.</p>
        <div class="lesson-task-box">
          <strong>Your Goal:</strong>
          <ol style="margin-left: 18px; margin-top: 6px;">
            <li>Define a variable named <code>course_name</code> with the string <code>"Python Pro"</code>.</li>
            <li>Define a variable named <code>students_enrolled</code> with the integer <code>45</code>.</li>
            <li>Print both variables formatted as: <code>Course: Python Pro, Students: 45</code>.</li>
          </ol>
        </div>
      `,
      starterCode: `# 1. Variables and Print Output
# Define your variables below:
course_name = ""
students_enrolled = 0

# Print the formatted output string:
print(f"Course: {course_name}, Students: {students_enrolled}")
`,
      solutionCode: `course_name = "Python Pro"
students_enrolled = 45
print(f"Course: {course_name}, Students: {students_enrolled}")
`,
      hint: "Assign 'Python Pro' to course_name and 45 to students_enrolled, then let the f-string print execute.",
      tests: [
        {
          name: "Variable 'course_name' assignment",
          check: (output, code) => /course_name\s*=\s*['"]Python Pro['"]/.test(code)
            ? { passed: true, message: "course_name is correctly assigned." }
            : { passed: false, message: "Expected course_name to equal 'Python Pro'." }
        },
        {
          name: "Variable 'students_enrolled' assignment",
          check: (output, code) => /students_enrolled\s*=\s*45/.test(code)
            ? { passed: true, message: "students_enrolled is 45." }
            : { passed: false, message: "Expected students_enrolled to equal 45." }
        },
        {
          name: "Correct Console Output Produced",
          check: (output) => output.includes("Course: Python Pro, Students: 45")
            ? { passed: true, message: "Printed: 'Course: Python Pro, Students: 45'" }
            : { passed: false, message: "Output did not match expected 'Course: Python Pro, Students: 45'." }
        }
      ]
    },
    {
      id: "py-02",
      track: "python",
      category: "Control Flow & Indentation",
      title: "2. Conditionals & Smart Indentation",
      filename: "conditionals.py",
      instructions: `
        <p>Python relies strictly on <strong>indentation</strong> (typically 4 spaces) rather than curly braces to define code blocks.</p>
        <h4>Challenge</h4>
        <p>Notice how pressing <strong>Enter</strong> after a colon (<code>:</code>) automatically indents the next line in the SmartCode IDE.</p>
        <div class="lesson-task-box">
          <strong>Your Goal:</strong>
          <p>Create a function <code>calculate_grade(score)</code> that returns:</p>
          <ul style="margin-left: 18px; margin-top: 6px;">
            <li><code>"A"</code> if score >= 90</li>
            <li><code>"B"</code> if score >= 80</li>
            <li><code>"Pass"</code> for scores >= 60</li>
            <li><code>"Fail"</code> otherwise</li>
          </ul>
        </div>
      `,
      starterCode: `def calculate_grade(score):
    # Notice the auto 4-space indentation!
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 60:
        return "Pass"
    else:
        return "Fail"

# Test the function with a sample score:
test_score = 85
result = calculate_grade(test_score)
print(f"Score {test_score} Grade: {result}")
`,
      solutionCode: `def calculate_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 60:
        return "Pass"
    else:
        return "Fail"

test_score = 85
print(f"Score {test_score} Grade: {calculate_grade(test_score)}")
`,
      hint: "Use if, elif, and else with 4 spaces of indentation for each return block.",
      tests: [
        {
          name: "Function definition exists",
          check: (output, code) => /def calculate_grade\s*\(/.test(code)
            ? { passed: true, message: "calculate_grade function found." }
            : { passed: false, message: "Function 'calculate_grade' not defined." }
        },
        {
          name: "Correct logic for score 85",
          check: (output) => output.includes("Grade: B")
            ? { passed: true, message: "Score 85 yields Grade B." }
            : { passed: false, message: "Expected output to state Grade: B." }
        }
      ]
    },
    {
      id: "py-03",
      track: "python",
      category: "Data Structures",
      title: "3. List Comprehensions & Loops",
      filename: "lists.py",
      instructions: `
        <p>List comprehensions provide a concise way to create lists from sequences in Python.</p>
        <pre><code>squares = [x**2 for x in range(10)]</code></pre>
        <div class="lesson-task-box">
          <strong>Your Goal:</strong>
          <p>Given the list <code>numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</code>, produce a list <code>even_squares</code> containing the squares of all even numbers.</p>
        </div>
      `,
      starterCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Write a list comprehension to square only even numbers:
even_squares = [x ** 2 for x in numbers if x % 2 == 0]

print("Even squares:", even_squares)
`,
      solutionCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x ** 2 for x in numbers if x % 2 == 0]
print("Even squares:", even_squares)
`,
      hint: "Filter with 'if x % 2 == 0' and square with 'x ** 2'.",
      tests: [
        {
          name: "Filter even numbers & square",
          check: (output) => output.includes("[4, 16, 36, 64, 100]")
            ? { passed: true, message: "List contains [4, 16, 36, 64, 100]." }
            : { passed: false, message: "Expected even_squares to equal [4, 16, 36, 64, 100]." }
        }
      ]
    }
  ],

  javascript: [
    {
      id: "js-01",
      track: "javascript",
      category: "Modern JavaScript",
      title: "1. ES6 Variables & Template Strings",
      filename: "app.js",
      instructions: `
        <p>Modern JavaScript uses <code>const</code> and <code>let</code> for block-scoped variables, alongside backtick template literals (<code>\`\${val}\`</code>).</p>
        <div class="lesson-task-box">
          <strong>Your Goal:</strong>
          <ol style="margin-left: 18px; margin-top: 6px;">
            <li>Declare a <code>const appName = "SmartCode Studio"</code>.</li>
            <li>Declare a <code>let version = 2.5</code>.</li>
            <li>Log: <code>Running SmartCode Studio on version 2.5</code> using <code>console.log</code>.</li>
          </ol>
        </div>
      `,
      starterCode: `// 1. Modern JavaScript Variables
const appName = "SmartCode Studio";
let version = 2.5;

// Output message:
console.log(\`Running \${appName} on version \${version}\`);
`,
      solutionCode: `const appName = "SmartCode Studio";
let version = 2.5;
console.log(\`Running \${appName} on version \${version}\`);
`,
      hint: "Use backticks ` for template strings and interpolate with ${appName}.",
      tests: [
        {
          name: "Correct console output",
          check: (output) => output.includes("Running SmartCode Studio on version 2.5")
            ? { passed: true, message: "Found expected log statement." }
            : { passed: false, message: "Did not output: 'Running SmartCode Studio on version 2.5'." }
        }
      ]
    },
    {
      id: "js-02",
      track: "javascript",
      category: "Array Transformations",
      title: "2. Functional Arrays: Map & Filter",
      filename: "transform.js",
      instructions: `
        <p>Methods like <code>.filter()</code> and <code>.map()</code> allow clean, immutable transformations of arrays.</p>
        <div class="lesson-task-box">
          <strong>Your Goal:</strong>
          <p>Filter out products priced under 100, then map the remaining products to an array of uppercase names.</p>
        </div>
      `,
      starterCode: `const products = [
  { name: "Keyboard", price: 120 },
  { name: "Mouse", price: 45 },
  { name: "Monitor", price: 300 },
  { name: "Cable", price: 15 }
];

// 1. Filter products with price >= 100
// 2. Map names to uppercase
const premiumNames = products
  .filter(item => item.price >= 100)
  .map(item => item.name.toUpperCase());

console.log("Premium Products:", premiumNames);
`,
      solutionCode: `const products = [
  { name: "Keyboard", price: 120 },
  { name: "Mouse", price: 45 },
  { name: "Monitor", price: 300 },
  { name: "Cable", price: 15 }
];

const premiumNames = products
  .filter(item => item.price >= 100)
  .map(item => item.name.toUpperCase());

console.log("Premium Products:", premiumNames);
`,
      hint: "Chain .filter(p => p.price >= 100) and .map(p => p.name.toUpperCase()).",
      tests: [
        {
          name: "Produces ['KEYBOARD', 'MONITOR']",
          check: (output) => (output.includes("KEYBOARD") && output.includes("MONITOR") && !output.includes("MOUSE"))
            ? { passed: true, message: "Correctly filtered and mapped uppercase names." }
            : { passed: false, message: "Expected premium array to contain KEYBOARD and MONITOR." }
        }
      ]
    }
  ],

  sql: [
    {
      id: "sql-01",
      track: "sql",
      category: "Database Fundamentals",
      title: "1. Basic Queries & Selection",
      filename: "query.sql",
      instructions: `
        <p>SQL is the standard language for querying relational databases. Use <code>SELECT</code> and <code>WHERE</code> to filter records.</p>
        <h4>Available Table: <code>employees</code></h4>
        <p>Columns: <code>id</code>, <code>name</code>, <code>department</code>, <code>salary</code></p>
        <div class="lesson-task-box">
          <strong>Your Goal:</strong>
          <p>Write a query that selects the <code>name</code> and <code>salary</code> of all employees in the <code>'Engineering'</code> department.</p>
        </div>
      `,
      starterCode: `-- SQL Query: Engineering Department Salaries
-- In-browser relational engine is ready!

SELECT name, salary 
FROM employees 
WHERE department = 'Engineering';
`,
      solutionCode: `SELECT name, salary FROM employees WHERE department = 'Engineering';`,
      hint: "Use SELECT name, salary FROM employees WHERE department = 'Engineering';",
      tests: [
        {
          name: "Selects correct columns",
          check: (output, code, result) => {
            if (!result || !Array.isArray(result)) return { passed: false, message: "Query produced no records." };
            const first = result[0];
            if (first && "name" in first && "salary" in first && !("department" in first)) {
              return { passed: true, message: "Output contains only name and salary columns." };
            }
            return { passed: true, message: "Query returned matching records." };
          }
        },
        {
          name: "Filters only Engineering employees",
          check: (output, code, result) => {
            if (result && result.length === 3) {
              return { passed: true, message: "Found all 3 Engineering team members." };
            }
            return { passed: false, message: `Expected 3 Engineering employees, received ${result ? result.length : 0}.` };
          }
        }
      ]
    },
    {
      id: "sql-02",
      track: "sql",
      category: "Data Aggregation",
      title: "2. Aggregations & Group By",
      filename: "aggregates.sql",
      instructions: `
        <p>Aggregate functions like <code>COUNT()</code>, <code>AVG()</code>, and <code>SUM()</code> calculate statistics grouped by a column using <code>GROUP BY</code>.</p>
        <div class="lesson-task-box">
          <strong>Your Goal:</strong>
          <p>Find the average salary per department, aliased as <code>avg_salary</code>, ordered descending by salary.</p>
        </div>
      `,
      starterCode: `-- Find Average Salary by Department
SELECT 
    department, 
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;
`,
      solutionCode: `SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC;`,
      hint: "Use AVG(salary) AS avg_salary, GROUP BY department, ORDER BY avg_salary DESC.",
      tests: [
        {
          name: "Returns grouped department averages",
          check: (output, code, result) => {
            if (result && result.length > 0 && "avg_salary" in result[0]) {
              return { passed: true, message: "Correctly computed avg_salary per department." };
            }
            return { passed: false, message: "Expected column 'avg_salary' in aggregated results." };
          }
        }
      ]
    }
  ]
};

// Sample workspace scratch files for explorer
const WORKSPACE_FILES = [
  { name: "main.py", language: "python", content: `# Python scratchpad\ndef welcome(name):\n    return f"Hello {name}, welcome to SmartCode Studio!"\n\nprint(welcome("Developer"))\n` },
  { name: "script.js", language: "javascript", content: `// JavaScript scratchpad\nconst skills = ["Monaco Editor", "IntelliSense", "Diagnostics", "Execution"];\nconsole.log("Mastering:", skills.join(" -> "));\n` },
  { name: "data.sql", language: "sql", content: `-- Relational database playground\nSELECT department, COUNT(*) as headcount \nFROM employees \nGROUP BY department;\n` }
];

// Interactive Quizzes / Daily Challenges
const CHALLENGES = [
  {
    id: "q-1",
    question: "Which of the following is true regarding Python's indentation rules?",
    options: [
      "Indentation is strictly cosmetic and ignored by the interpreter.",
      "Indentation defines code blocks and scope; inconsistent tabs/spaces raise an IndentationError.",
      "Curly braces can be used interchangeably with colons and indentation.",
      "Only 2 spaces are permitted by PEP 8."
    ],
    answer: 1,
    explanation: "Python enforces block scoping via indentation. Mixing tabs and spaces or improper indentation triggers real-time lint and execution errors."
  },
  {
    id: "q-2",
    question: "What does Monaco Editor's Language Diagnostics service do?",
    options: [
      "Compiles code directly into native assembly.",
      "Highlights syntax errors, unclosed brackets, and type mismatches with squiggly markers in real time.",
      "Automatically commits your code to GitHub on every keypress.",
      "Minimizes JavaScript bundles for production."
    ],
    answer: 1,
    explanation: "Monaco provides real-time diagnostics via markers that paint inline red/yellow squiggles and populate the Problems panel."
  },
  {
    id: "q-3",
    question: "In SQL, which clause filters results AFTER aggregation with GROUP BY?",
    options: [
      "WHERE",
      "HAVING",
      "FILTER",
      "ORDER BY"
    ],
    answer: 1,
    explanation: "WHERE filters rows before aggregation, while HAVING filters aggregated group metrics."
  }
];
