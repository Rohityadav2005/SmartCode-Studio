/**
 * SmartCode Studio - Comprehensive 30-Quiz Level Datasets
 * Level 1: Beginner Fundamentals (30 Questions)
 * Level 2: Intermediate Data Structures & Control Flow (30 Questions)
 * Level 3: Advanced Architecture & System Logic (30 Questions)
 */

const QUIZ_LEVELS = [
  {
    id: "level-1",
    name: "Level 1: Syntax & Core Fundamentals",
    badge: "Novice Coder",
    description: "Master Python variables, operators, strings, indentation rules, and basic expressions.",
    xpReward: 30,
    questions: [
      {
        id: 1,
        question: "What is the output of the following Python expression?",
        code: "x = 5\ny = '5'\nprint(x * 2, y * 2)",
        options: ["10 10", "10 55", "55 10", "TypeError: cannot multiply sequence by non-int"],
        answer: 1,
        explanation: "Multiplying integer 5 by 2 performs arithmetic (10), while multiplying string '5' by 2 repeats the string ('55')."
      },
      {
        id: 2,
        question: "Which of the following is an invalid variable name in Python?",
        code: null,
        options: ["_private_var", "user_score_2", "2nd_player", "CamelCaseName"],
        answer: 2,
        explanation: "Variable names in Python cannot begin with a numeric digit (2nd_player is invalid syntax)."
      },
      {
        id: 3,
        question: "What will the following code print?",
        code: "text = 'SmartCode'\nprint(text[1:5])",
        options: ["Smar", "mart", "martC", "martCode"],
        answer: 1,
        explanation: "Slicing text[1:5] starts at index 1 ('m') and stops before index 5 ('C'), yielding 'mart'."
      },
      {
        id: 4,
        question: "How does Python determine code blocks and variable scope inside functions and loops?",
        code: null,
        options: [
          "Using curly braces { } like C and Java",
          "Using begin and end keywords",
          "Using consistent indentation (spaces or tabs)",
          "Using semicolons ; at line endings"
        ],
        answer: 2,
        explanation: "Python enforces block scoping and control flow structure strictly through consistent indentation (typically 4 spaces per PEP 8)."
      },
      {
        id: 5,
        question: "What is the return value of bool([]) and bool([0]) in Python?",
        code: "print(bool([]), bool([0]))",
        options: ["False False", "True True", "False True", "True False"],
        answer: 2,
        explanation: "An empty list [] evaluates to falsy (False), whereas [0] is a non-empty list, so it evaluates to truthy (True)."
      },
      {
        id: 6,
        question: "What is the result of 17 // 4 and 17 % 4?",
        code: "print(17 // 4, 17 % 4)",
        options: ["4.25 1", "4 1", "4 2", "5 1"],
        answer: 1,
        explanation: "// performs floor division yielding integer 4, and % calculates remainder modulo yielding 1."
      },
      {
        id: 7,
        question: "What is the correct way to format a string using Python 3 f-strings?",
        code: null,
        options: [
          "f'User {name} scored {score}'",
          "'User %s scored %d' % (name, score)",
          "'User {0} scored {1}'.format(name, score)",
          "format('User ' + name + ' scored ' + score)"
        ],
        answer: 0,
        explanation: "f'...' formatted string literals were introduced in Python 3.6 for readable, performant interpolation."
      },
      {
        id: 8,
        question: "Which of the following data types in Python is IMMUTABLE?",
        code: null,
        options: ["List", "Dictionary", "Tuple", "Set"],
        answer: 2,
        explanation: "Tuples cannot be modified after creation (immutable), while lists, dictionaries, and sets are mutable."
      },
      {
        id: 9,
        question: "What is the output of the following slice?",
        code: "nums = [10, 20, 30, 40, 50]\nprint(nums[::-1])",
        options: ["[10, 20, 30, 40, 50]", "[50, 40, 30, 20, 10]", "[50]", "IndexError: out of range"],
        answer: 1,
        explanation: "The slice step -1 reverses the entire sequence, returning [50, 40, 30, 20, 10]."
      },
      {
        id: 10,
        question: "What error is raised when accessing a dictionary key that does not exist using bracket notation d['key']?",
        code: null,
        options: ["IndexError", "KeyError", "ValueError", "None"],
        answer: 1,
        explanation: "d[key] raises a KeyError if key is missing. Use d.get(key, default) to return a safe fallback."
      },
      {
        id: 11,
        question: "What does the range(2, 10, 3) function call generate?",
        code: "list(range(2, 10, 3))",
        options: ["[2, 5, 8]", "[2, 3, 4, 5, 6, 7, 8, 9]", "[2, 6, 10]", "[5, 8]"],
        answer: 0,
        explanation: "range(start=2, stop=10, step=3) starts at 2 and steps by 3: 2, 5, 8 (11 exceeds stop)."
      },
      {
        id: 12,
        question: "What does the strip() string method do in Python?",
        code: "'   hello world  \\n'.strip()",
        options: [
          "Removes all spaces everywhere inside the string",
          "Removes leading and trailing whitespace characters",
          "Splits the string into words",
          "Converts string characters into uppercase"
        ],
        answer: 1,
        explanation: "strip() strips all leading and trailing whitespace (spaces, tabs, newlines) from both ends of the string."
      },
      {
        id: 13,
        question: "What will type( (42) ) versus type( (42,) ) produce?",
        code: "print(type((42)), type((42,)))",
        options: [
          "<class 'tuple'> <class 'tuple'>",
          "<class 'int'> <class 'tuple'>",
          "<class 'int'> <class 'int'>",
          "<class 'tuple'> <class 'int'>"
        ],
        answer: 1,
        explanation: "(42) is treated as a parenthesized integer, while the trailing comma in (42,) defines a single-element tuple."
      },
      {
        id: 14,
        question: "What is the output of the following membership test?",
        code: "d = {'a': 1, 'b': 2}\nprint(1 in d, 'a' in d)",
        options: ["True True", "False True", "True False", "False False"],
        answer: 1,
        explanation: "The 'in' operator checks keys by default on dictionaries, so 1 in d is False and 'a' in d is True."
      },
      {
        id: 15,
        question: "What will print(len(set([1, 2, 2, 3, 3, 3]))) output?",
        code: "s = set([1, 2, 2, 3, 3, 3])\nprint(len(s))",
        options: ["6", "3", "1", "TypeError"],
        answer: 1,
        explanation: "Sets store unique elements only. The duplicates are eliminated, leaving {1, 2, 3} with length 3."
      },
      {
        id: 16,
        question: "What does the 'is' keyword compare in Python versus '=='?",
        code: null,
        options: [
          "'is' checks object identity in memory, while '==' checks value equality",
          "'is' checks value equality, while '==' checks memory addresses",
          "Both keywords are 100% identical in all cases",
          "'is' is only used for string comparison"
        ],
        answer: 0,
        explanation: "a == b compares whether two objects have equivalent values, whereas a is b checks if both reference the exact same memory address (id(a) == id(b))."
      },
      {
        id: 17,
        question: "What does the break statement do inside a loop?",
        code: null,
        options: [
          "Skips to the next iteration of the loop",
          "Terminates the loop immediately and transfers control to the next block",
          "Resets the loop counter to 0",
          "Pauses execution for 1 second"
        ],
        answer: 1,
        explanation: "break terminates execution of the innermost enclosing loop immediately."
      },
      {
        id: 18,
        question: "What does the continue statement do in a loop?",
        code: null,
        options: [
          "Exits the entire program",
          "Stops the loop completely",
          "Skips the rest of the current iteration and jumps to the next iteration",
          "Prints loop statistics to the console"
        ],
        answer: 2,
        explanation: "continue skips the remainder of the current loop iteration and moves directly to the next cycle."
      },
      {
        id: 19,
        question: "What will the following code print?",
        code: "def add_item(val, lst=[]):\n    lst.append(val)\n    return lst\n\nprint(add_item(1))\nprint(add_item(2))",
        options: ["[1] then [2]", "[1] then [1, 2]", "[1, 2] then [1, 2]", "TypeError"],
        answer: 1,
        explanation: "Default parameter lists in Python are mutable and evaluated once at function definition time, so lst persists across invocations."
      },
      {
        id: 20,
        question: "How do you define a single-line lambda function that squares a number?",
        code: null,
        options: [
          "lambda x: x ** 2",
          "def lambda(x): return x ** 2",
          "x => x ** 2",
          "function(x) { return x ** 2; }"
        ],
        answer: 0,
        explanation: "In Python, anonymous functions are defined using the 'lambda' keyword: lambda args: expression."
      },
      {
        id: 21,
        question: "What is the output of the following list comprehension?",
        code: "evens = [x for x in range(6) if x % 2 == 0]\nprint(evens)",
        options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 2, 4, 6]", "[2, 4]"],
        answer: 0,
        explanation: "range(6) generates 0, 1, 2, 3, 4, 5. The condition x % 2 == 0 filters 0, 2, 4."
      },
      {
        id: 22,
        question: "What does the pass statement do in Python?",
        code: null,
        options: [
          "Skips the next line of code",
          "Acts as a syntactic null statement / placeholder that does nothing",
          "Passes data to standard output",
          "Exits the function with status code 0"
        ],
        answer: 1,
        explanation: "pass is a null operation used as a placeholder where code is required syntactically (e.g. empty functions or classes)."
      },
      {
        id: 23,
        question: "What is the result of 'abc'.upper()?",
        code: null,
        options: ["'Abc'", "'ABC'", "'abc'", "TypeError"],
        answer: 1,
        explanation: "The upper() method returns a copy of the string converted to all uppercase characters ('ABC')."
      },
      {
        id: 24,
        question: "What is the output of min([15, 3, 8, 22, 1])?",
        code: null,
        options: ["15", "3", "22", "1"],
        answer: 3,
        explanation: "The built-in min() function scans the iterable and returns the smallest item (1)."
      },
      {
        id: 25,
        question: "What will float('3.14') return?",
        code: null,
        options: ["3.14 as a float number", "'3.14' as a string", "3 as an integer", "ValueError"],
        answer: 0,
        explanation: "float() parses valid numeric strings into double-precision IEEE 754 floating point numbers."
      },
      {
        id: 26,
        question: "What does the enumerate() function provide during iteration?",
        code: "for i, v in enumerate(['a', 'b']): ...",
        options: [
          "Only the elements in reverse order",
          "Pairs of (index, value) starting from index 0",
          "A random sample from the sequence",
          "The total count of items in the list"
        ],
        answer: 1,
        explanation: "enumerate(iterable, start=0) yields tuples containing the count/index alongside the current value."
      },
      {
        id: 27,
        question: "Which keyword is used to handle exceptions in Python?",
        code: null,
        options: ["catch", "except", "rescue", "trap"],
        answer: 1,
        explanation: "Python uses try...except...finally blocks to catch and handle exceptions (unlike C++/Java's try...catch)."
      },
      {
        id: 28,
        question: "What does the zip() function do when passed two lists of different lengths?",
        code: "list(zip([1, 2, 3], ['a', 'b']))",
        options: [
          "[(1, 'a'), (2, 'b')]",
          "[(1, 'a'), (2, 'b'), (3, None)]",
          "ValueError: length mismatch",
          "[(1, 'a'), (2, 'b'), (3, '')]"
        ],
        answer: 0,
        explanation: "In standard Python 3, zip() stops pairing items as soon as the shortest iterable is exhausted."
      },
      {
        id: 29,
        question: "What does the dictionary method .get(key, default) return when the key exists?",
        code: "d = {'x': 100}\nprint(d.get('x', 0))",
        options: ["0", "100", "None", "KeyError"],
        answer: 1,
        explanation: "If the key exists, .get(key, default) returns the key's value (100). The default is only returned if missing."
      },
      {
        id: 30,
        question: "What is the output of sorted([3, 1, 4, 1, 5]) in Python?",
        code: null,
        options: [
          "[5, 4, 3, 1, 1]",
          "[1, 1, 3, 4, 5]",
          "[1, 3, 4, 5]",
          "[3, 1, 4, 1, 5]"
        ],
        answer: 1,
        explanation: "sorted() returns a new list containing all items in ascending order: [1, 1, 3, 4, 5]."
      }
    ]
  },
  {
    id: "level-2",
    name: "Level 2: Data Structures & Algorithmic Patterns",
    badge: "Byte Adept",
    description: "Deep dive into Hash Maps, Recursion, Time Complexity, SQL Joins, and ES6 Async mechanics.",
    xpReward: 30,
    questions: [
      {
        id: 31,
        question: "What is the average time complexity of searching for an item in a Python dictionary (Hash Map)?",
        code: null,
        options: ["O(1) constant time", "O(N) linear time", "O(log N) logarithmic time", "O(N^2) quadratic time"],
        answer: 0,
        explanation: "Hash maps compute key hash buckets directly, providing O(1) average lookup, insertion, and deletion complexity."
      },
      {
        id: 32,
        question: "In SQL, what is the difference between INNER JOIN and LEFT JOIN?",
        code: null,
        options: [
          "INNER JOIN returns all rows from both tables; LEFT JOIN returns matched rows only",
          "INNER JOIN returns only rows with matches in both tables; LEFT JOIN returns all left rows plus matching right rows",
          "LEFT JOIN excludes rows with NULL values",
          "Both joins produce identical results in relational calculus"
        ],
        answer: 1,
        explanation: "INNER JOIN selects records where there is a match in both tables. LEFT JOIN returns all rows from the left table, with NULLs for unmatched right rows."
      },
      {
        id: 33,
        question: "What is the output of JavaScript's '2' + 2 - 1?",
        code: "console.log('2' + 2 - 1);",
        options: ["3", "21", "NaN", "TypeError"],
        answer: 1,
        explanation: "'2' + 2 performs string concatenation ('22'). Then '22' - 1 coerces the string to number 22 - 1 = 21."
      },
      {
        id: 34,
        question: "In Python, what is the difference between list.sort() and sorted(list)?",
        code: null,
        options: [
          "list.sort() modifies the list in-place and returns None; sorted() returns a brand new sorted list",
          "sorted() modifies the list in-place; list.sort() returns a new list",
          "list.sort() only works on numbers; sorted() only works on strings",
          "They are identical alias functions"
        ],
        answer: 0,
        explanation: "list.sort() mutates the original list in-place returning None. sorted() does not modify the original list and returns a new sorted list."
      },
      {
        id: 35,
        question: "What is the space complexity of a recursive Fibonacci function without memoization?",
        code: "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)",
        options: ["O(1)", "O(N)", "O(2^N)", "O(N log N)"],
        answer: 1,
        explanation: "The call stack depth reaches at most N frames simultaneously, resulting in O(N) space complexity (even though time complexity is O(2^N))."
      },
      {
        id: 36,
        question: "What SQL clause is used to filter records AFTER an aggregation with GROUP BY?",
        code: "SELECT dept, COUNT(*) FROM emp GROUP BY dept ...",
        options: ["WHERE", "HAVING", "FILTER", "ORDER BY"],
        answer: 1,
        explanation: "WHERE filters rows before aggregation occurs, while HAVING filters grouped metric results after GROUP BY."
      },
      {
        id: 37,
        question: "In JavaScript, what does Promise.all() do when one of the passed promises rejects?",
        code: null,
        options: [
          "Waits for all other promises to finish, then returns valid results",
          "Immediately rejects with the error of that rejected promise",
          "Retries the rejected promise automatically 3 times",
          "Ignores the rejected promise and resolves the rest"
        ],
        answer: 1,
        explanation: "Promise.all() adopts an all-or-nothing short-circuit strategy: if any input promise rejects, the returned promise immediately rejects with that reason."
      },
      {
        id: 38,
        question: "What is the output of the following generator expression?",
        code: "g = (x * 2 for x in [1, 2, 3])\nprint(next(g), next(g))",
        options: ["2 4", "[2, 4]", "1 2", "StopIteration"],
        answer: 0,
        explanation: "Generators yield values lazily on demand. The first next() produces 1*2 = 2, and the second next() produces 2*2 = 4."
      },
      {
        id: 39,
        question: "Which of the following is true regarding SQL Primary Keys?",
        code: null,
        options: [
          "A table can have multiple primary keys",
          "Primary keys permit duplicate values if clustered",
          "A primary key uniquely identifies each record and cannot contain NULL values",
          "Primary keys must always be integer values"
        ],
        answer: 2,
        explanation: "Primary keys enforce entity integrity: they must be strictly unique across all rows and cannot contain NULL."
      },
      {
        id: 40,
        question: "What is the time complexity of finding an element in a balanced Binary Search Tree (BST) of N nodes?",
        code: null,
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        answer: 1,
        explanation: "At each comparison in a balanced BST, the search space is halved, giving logarithmic O(log N) lookup time."
      },
      {
        id: 41,
        question: "What will the following Python dictionary comprehension produce?",
        code: "d = {k: k**2 for k in range(3)}\nprint(d)",
        options: ["{0: 0, 1: 1, 2: 4}", "[0, 1, 4]", "{1: 1, 2: 4, 3: 9}", "{0, 1, 4}"],
        answer: 0,
        explanation: "The dictionary comprehension maps each key k to k**2 for k in [0, 1, 2], resulting in {0: 0, 1: 1, 2: 4}."
      },
      {
        id: 42,
        question: "What does the SQL LIKE wildcard '%' represent?",
        code: "SELECT * FROM users WHERE name LIKE 'A%';",
        options: [
          "Exactly one single character",
          "Zero, one, or multiple characters",
          "A numeric digit only",
          "Any punctuation mark"
        ],
        answer: 1,
        explanation: "% matches any sequence of zero or more characters. The underscore '_' matches exactly one character."
      },
      {
        id: 43,
        question: "What does JavaScript's Array.prototype.reduce() do?",
        code: "[1, 2, 3, 4].reduce((acc, curr) => acc + curr, 0)",
        options: [
          "Shrinks the length of the array to 1 element",
          "Executes a reducer function on each element, resulting in a single output accumulator value",
          "Filters items that match a boolean condition",
          "Sorts the array in descending order"
        ],
        answer: 1,
        explanation: "reduce() iterates through an array accumulating values into a single return value (in this case, summing to 10)."
      },
      {
        id: 44,
        question: "What is the primary difference between a Stack and a Queue data structure?",
        code: null,
        options: [
          "Stacks are FIFO (First-In-First-Out); Queues are LIFO (Last-In-First-Out)",
          "Stacks are LIFO (Last-In-First-Out); Queues are FIFO (First-In-First-Out)",
          "Stacks are unordered; Queues are sorted",
          "Queues only allow numeric elements"
        ],
        answer: 1,
        explanation: "A Stack operates on Last-In-First-Out (LIFO), whereas a Queue operates on First-In-First-Out (FIFO)."
      },
      {
        id: 45,
        question: "What is a closure in programming?",
        code: null,
        options: [
          "A function bundled together with references to its surrounding lexical state (scope)",
          "The process of closing a file handle or network socket",
          "A loop that has no termination condition",
          "A private method inside an abstract class"
        ],
        answer: 0,
        explanation: "A closure gives an inner function access to its outer enclosing function's scope variables even after the outer function has executed."
      },
      {
        id: 46,
        question: "What will the following code print?",
        code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)",
        options: ["[1, 2, 3]", "[1, 2, 3, 4]", "TypeError", "[4]"],
        answer: 1,
        explanation: "b = a assigns a reference to the same list object in memory, so modifying b also alters a."
      },
      {
        id: 47,
        question: "How do you create an independent shallow copy of a list 'original' in Python?",
        code: null,
        options: ["copy = original", "copy = original[:]", "copy = list(original)", "Both B and C are valid"],
        answer: 3,
        explanation: "Both slice copying original[:] and using the constructor list(original) or copy.copy() create a distinct shallow list."
      },
      {
        id: 48,
        question: "What is the purpose of the SQL UNION ALL operator compared to UNION?",
        code: null,
        options: [
          "UNION ALL retains duplicate rows, while UNION removes duplicates",
          "UNION ALL is slower because it sorts records",
          "UNION combines tables horizontally; UNION ALL combines them vertically",
          "UNION ALL only works on numerical columns"
        ],
        answer: 0,
        explanation: "UNION ALL combines result sets without checking for or removing duplicate rows, making it significantly faster than UNION."
      },
      {
        id: 49,
        question: "What does the *args parameter allow in a Python function definition?",
        code: "def func(*args): ...",
        options: [
          "Keyword arguments passed as a dictionary",
          "An arbitrary number of positional arguments passed as a tuple",
          "Only pointer references to variables",
          "Required arguments that cannot be omitted"
        ],
        answer: 1,
        explanation: "*args collects arbitrary positional arguments into a tuple. **kwargs collects keyword arguments into a dictionary."
      },
      {
        id: 50,
        question: "What is the worst-case time complexity of QuickSort?",
        code: null,
        options: ["O(N log N)", "O(N)", "O(N^2)", "O(log N)"],
        answer: 2,
        explanation: "When pivot selection is poor (e.g. sorted array with first element as pivot), QuickSort degrades to O(N^2) quadratic time."
      },
      {
        id: 51,
        question: "What does the SQL COALESCE(val1, val2, val3) function return?",
        code: "SELECT COALESCE(bonus, commission, 0) FROM emp;",
        options: [
          "The sum of all non-null values",
          "The first non-NULL expression in the arguments list",
          "True if all values are identical",
          "The maximum value among the arguments"
        ],
        answer: 1,
        explanation: "COALESCE() evaluates arguments in order and returns the first non-NULL value found."
      },
      {
        id: 52,
        question: "In JavaScript, what will Boolean('') and Boolean('false') return?",
        code: "console.log(Boolean(''), Boolean('false'));",
        options: ["false false", "false true", "true false", "true true"],
        answer: 1,
        explanation: "An empty string '' is falsy (false), while 'false' is a non-empty string, making it truthy (true)."
      },
      {
        id: 53,
        question: "What does the any() function return in Python when given [False, False, True]?",
        code: "print(any([False, False, True]))",
        options: ["True", "False", "None", "TypeError"],
        answer: 0,
        explanation: "any() returns True if at least one element of the iterable evaluates to truthy."
      },
      {
        id: 54,
        question: "What does the all() function return in Python when given [True, True, False]?",
        code: "print(all([True, True, False]))",
        options: ["True", "False", "None", "TypeError"],
        answer: 1,
        explanation: "all() returns True only if every single element in the iterable is truthy."
      },
      {
        id: 55,
        question: "What is the time complexity of appending an item to the end of a dynamic array (Python list)?",
        code: "lst.append(item)",
        options: ["O(1) amortized", "O(N) always", "O(log N)", "O(N^2)"],
        answer: 0,
        explanation: "Appending to a Python list takes O(1) amortized constant time because dynamic arrays preallocate capacity in chunks."
      },
      {
        id: 56,
        question: "What SQL statement is used to remove all records from a table without logging individual row deletions?",
        code: null,
        options: ["DELETE FROM table;", "TRUNCATE TABLE table;", "DROP TABLE table;", "REMOVE table;"],
        answer: 1,
        explanation: "TRUNCATE TABLE deallocates entire data pages, making it much faster than DELETE while preserving table structure."
      },
      {
        id: 57,
        question: "What will the following Python code output?",
        code: "x = (1, 2, [3, 4])\nx[2].append(5)\nprint(x)",
        options: [
          "TypeError: tuple does not support item assignment",
          "(1, 2, [3, 4, 5])",
          "(1, 2, [3, 4])",
          "AttributeError"
        ],
        answer: 1,
        explanation: "The tuple's reference to the list at index 2 cannot be changed, but the mutable list itself CAN be appended in-place!"
      },
      {
        id: 58,
        question: "What is an idempotency property in API and system design?",
        code: null,
        options: [
          "An operation that can be executed multiple times without changing the result beyond the initial application",
          "An endpoint that requires authentication credentials",
          "A database transaction that auto-reverts on failure",
          "A caching header that expires in 60 seconds"
        ],
        answer: 0,
        explanation: "Idempotent operations (e.g. HTTP GET, PUT, DELETE) produce the same state regardless of whether called once or 100 times."
      },
      {
        id: 59,
        question: "What will math.floor(3.9) versus round(3.9) produce in Python?",
        code: "import math\nprint(math.floor(3.9), round(3.9))",
        options: ["3 4", "4 4", "3 3", "3.0 4.0"],
        answer: 0,
        explanation: "floor() always rounds downward to nearest integer (3), while round(3.9) rounds to nearest integer (4)."
      },
      {
        id: 60,
        question: "What does the with statement (Context Manager) guarantee in Python?",
        code: "with open('file.txt') as f: ...",
        options: [
          "Code runs in parallel on multiple CPU threads",
          "Cleanup resources (e.g. closing files/locks) execute reliably even if exceptions occur",
          "The file is encrypted with AES-256",
          "Syntax errors inside the block are ignored"
        ],
        answer: 1,
        explanation: "Context managers guarantee entry setup and exit teardown (like calling f.close()), invoking __enter__ and __exit__."
      }
    ]
  }
];
