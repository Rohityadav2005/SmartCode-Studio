/**
 * SmartCode Studio - Main Application Controller
 * Handles user interactions, curriculum navigation, panel resizing,
 * test evaluations, quizzes, and UI state synchronization.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentMode: "learning", // "learning" or "playground"
    currentTrack: "python",
    activeLessonIndex: 0,
    userXP: 140,
    completedLessons: new Set(),
    userAnswers: {}
  };

  // Cache DOM elements
  const els = {
    modeLearning: document.getElementById("mode-learning"),
    modePlayground: document.getElementById("mode-playground"),
    trackIcon: document.getElementById("track-icon"),
    trackTitle: document.getElementById("track-title"),
    lessonTitle: document.getElementById("lesson-title"),
    languageSelect: document.getElementById("language-select"),
    themeSelect: document.getElementById("theme-select"),
    btnRun: document.getElementById("btn-run-code"),
    btnSubmit: document.getElementById("btn-submit-code"),
    btnReset: document.getElementById("btn-reset-code"),
    btnFormat: document.getElementById("btn-format"),
    activityBtns: document.querySelectorAll(".activity-btn"),
    sidePanels: document.querySelectorAll(".panel-view"),
    trackTabs: document.querySelectorAll(".track-tab"),
    lessonsList: document.getElementById("lessons-list"),
    lessonPane: document.getElementById("lesson-pane"),
    lessonCategory: document.getElementById("lesson-category"),
    lessonHeadline: document.getElementById("lesson-headline"),
    lessonContent: document.getElementById("lesson-instructions-content"),
    btnToggleLesson: document.getElementById("btn-toggle-lesson"),
    btnHintAccordion: document.getElementById("btn-hint-accordion"),
    hintContent: document.getElementById("hint-content"),
    hintText: document.getElementById("hint-text"),
    bottomTabs: document.querySelectorAll(".bottom-tab"),
    bottomViews: document.querySelectorAll(".bottom-view"),
    consoleOutput: document.getElementById("console-output-text"),
    btnClearConsole: document.getElementById("btn-clear-console"),
    testsContainer: document.getElementById("tests-container"),
    testsBadge: document.getElementById("tests-summary-badge"),
    sqlTableContainer: document.getElementById("sql-table-container"),
    challengesList: document.getElementById("challenges-list"),
    docsContent: document.getElementById("docs-content"),
    explorerTree: document.getElementById("explorer-tree"),
    xpDisplay: document.getElementById("user-xp"),
    progressBadge: document.getElementById("overall-progress-badge"),
    currentTabIcon: document.getElementById("current-tab-icon"),
    currentFileLabel: document.getElementById("current-file-label"),
    resizerSidebar: document.getElementById("resizer-sidebar"),
    resizerLesson: document.getElementById("resizer-lesson"),
    resizerBottom: document.getElementById("resizer-bottom"),
    sidePanel: document.getElementById("side-panel"),
    bottomPanel: document.getElementById("bottom-panel"),
    btnToggleBottom: document.getElementById("btn-toggle-bottom"),
    // New File & Fullscreen elements
    btnNewFile: document.getElementById("btn-new-file"),
    newFileBox: document.getElementById("new-file-box"),
    newFileInput: document.getElementById("new-file-input"),
    btnConfirmNewFile: document.getElementById("btn-confirm-new-file"),
    btnCancelNewFile: document.getElementById("btn-cancel-new-file"),
    btnNewTab: document.getElementById("btn-new-tab"),
    btnEditorExpand: document.getElementById("btn-editor-expand"),
    codeEditorWrapper: document.getElementById("code-editor-wrapper")
  };

  // Load saved workspace files or fallback to default WORKSPACE_FILES
  state.workspaceFiles = loadSavedFiles();

  function loadSavedFiles() {
    try {
      const saved = localStorage.getItem("smartcode_workspace_files");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load saved workspace files:", e);
    }
    return [...WORKSPACE_FILES];
  }

  function persistWorkspaceFiles() {
    try {
      localStorage.setItem("smartcode_workspace_files", JSON.stringify(state.workspaceFiles));
    } catch (e) {
      console.warn("Could not save workspace files:", e);
    }
  }

  // Initialize Monaco Editor
  window.SmartCodeEditor.init();

  // Once Monaco is ready, load first lesson
  window.SmartCodeEditor.onReady(() => {
    loadTrack(state.currentTrack, 0);
    renderExplorerTree();
    renderChallenges();
    renderDocs();
    setupResizers();
    setupShortcuts();
    showToast("SmartCode Studio Ready! Select a lesson or write code.", "info");
  });

  // ----------------------------------------------------
  // Mode Switching (Guided Learning vs Sandbox Playground)
  // ----------------------------------------------------
  els.modeLearning.addEventListener("click", () => switchMode("learning"));
  els.modePlayground.addEventListener("click", () => switchMode("playground"));

  function switchMode(mode) {
    state.currentMode = mode;
    els.modeLearning.classList.toggle("active", mode === "learning");
    els.modePlayground.classList.toggle("active", mode === "playground");

    if (mode === "playground") {
      els.lessonPane.classList.add("collapsed");
      showToast("Switched to Sandbox Playground mode (full-screen editor).", "info");
    } else {
      els.lessonPane.classList.remove("collapsed");
      showToast("Switched to Guided Learning mode.", "info");
    }
  }

  // ----------------------------------------------------
  // Activity Bar Navigation
  // ----------------------------------------------------
  els.activityBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetPanelId = btn.getAttribute("data-panel");
      if (!targetPanelId) return;

      if (btn.classList.contains("active") && !els.sidePanel.classList.contains("collapsed")) {
        // Toggle collapse
        els.sidePanel.classList.add("collapsed");
        btn.classList.remove("active");
        return;
      }

      els.sidePanel.classList.remove("collapsed");
      els.activityBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      els.sidePanels.forEach(panel => {
        panel.classList.toggle("active", panel.id === targetPanelId);
      });
    });
  });

  // ----------------------------------------------------
  // Track Switching (Python, JavaScript, SQL)
  // ----------------------------------------------------
  els.trackTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const track = tab.getAttribute("data-track");
      els.trackTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      loadTrack(track, 0);
    });
  });

  // Language Dropdown Change
  els.languageSelect.addEventListener("change", (e) => {
    const lang = e.target.value;
    loadTrack(lang, 0);
    // Sync track tab
    els.trackTabs.forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-track") === lang);
    });
  });

  // Theme Dropdown Change
  els.themeSelect.addEventListener("change", (e) => {
    const theme = e.target.value;
    document.body.className = `theme-${theme === 'vs' ? 'light' : (theme === 'cyberpunk' ? 'cyberpunk' : 'dark')}`;
    window.SmartCodeEditor.setTheme(theme);
    showToast(`Switched theme to ${theme}`, "info");
  });

  // ----------------------------------------------------
  // Curriculum & Lesson Loading
  // ----------------------------------------------------
  function loadTrack(trackName, lessonIndex = 0) {
    state.currentTrack = trackName;
    state.activeLessonIndex = lessonIndex;
    els.languageSelect.value = trackName;

    const lessons = CURRICULUM[trackName] || [];
    const lesson = lessons[lessonIndex];
    if (!lesson) return;

    // Update track badges & titles
    const trackIcons = {
      python: '<i class="fa-brands fa-python"></i>',
      javascript: '<i class="fa-brands fa-js"></i>',
      sql: '<i class="fa-solid fa-database"></i>'
    };
    if (els.trackIcon) els.trackIcon.innerHTML = trackIcons[trackName] || '<i class="fa-solid fa-code"></i>';
    if (els.trackTitle) els.trackTitle.textContent = trackName.toUpperCase() + " Track";
    if (els.lessonTitle) els.lessonTitle.textContent = lesson.title;

    // Update Lesson Pane
    els.lessonCategory.textContent = lesson.category;
    els.lessonHeadline.textContent = lesson.title;
    els.lessonContent.innerHTML = lesson.instructions;
    els.hintText.textContent = lesson.hint;
    els.hintContent.classList.remove("show");

    // Update Editor File Tab & Content
    els.currentFileLabel.textContent = lesson.filename;
    if (window.SmartCodeAI && window.SmartCodeAI.updateContextFileName) {
      window.SmartCodeAI.updateContextFileName(lesson.filename);
    }
    els.currentTabIcon.className = `fa-brands ${trackName === 'python' ? 'fa-python' : (trackName === 'javascript' ? 'fa-js' : 'fa-database')} tab-icon`;

    window.SmartCodeEditor.setLanguageAndCode(trackName, lesson.starterCode);

    renderLessonsList();
    renderDocs();
  }

  function renderLessonsList() {
    const lessons = CURRICULUM[state.currentTrack] || [];
    els.lessonsList.innerHTML = "";

    lessons.forEach((l, idx) => {
      const isDone = state.completedLessons.has(l.id);
      const isActive = idx === state.activeLessonIndex;

      const card = document.createElement("div");
      card.className = `lesson-nav-card ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="card-info">
          <span class="card-num">${l.category}</span>
          <span class="card-title">${l.title}</span>
        </div>
        <div class="card-check">
          <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-circle'}"></i>
        </div>
      `;

      card.addEventListener("click", () => {
        loadTrack(state.currentTrack, idx);
      });

      els.lessonsList.appendChild(card);
    });

    updateProgressBadge();
  }

  function updateProgressBadge() {
    let total = 0;
    Object.values(CURRICULUM).forEach(track => total += track.length);
    els.progressBadge.textContent = `${state.completedLessons.size}/${total} Done`;
  }

  // Toggle Lesson Pane Collapse
  els.btnToggleLesson.addEventListener("click", () => {
    els.lessonPane.classList.toggle("collapsed");
  });

  // Hint Accordion
  els.btnHintAccordion.addEventListener("click", () => {
    els.hintContent.classList.toggle("show");
  });

  // Format Code Button
  if (els.btnFormat) {
    els.btnFormat.addEventListener("click", () => {
      window.SmartCodeEditor.formatCode();
      showToast("Code automatically formatted!", "info");
    });
  }

  // Reset Code Button
  if (els.btnReset) {
    els.btnReset.addEventListener("click", () => {
      const lesson = CURRICULUM[state.currentTrack][state.activeLessonIndex];
      if (lesson) {
        window.SmartCodeEditor.editor.setValue(lesson.starterCode);
        showToast("Reset to initial starter code.", "info");
      }
    });
  }

  // ----------------------------------------------------
  // Execution: Run Code & Submit Solution
  // ----------------------------------------------------
  els.btnRun.addEventListener("click", () => runCodeAction(false));
  els.btnSubmit.addEventListener("click", () => runCodeAction(true));

  async function runCodeAction(isSubmit = false) {
    const editor = window.SmartCodeEditor.editor;
    if (!editor) return;

    const code = editor.getValue();
    const language = state.currentTrack;
    const lesson = CURRICULUM[language][state.activeLessonIndex];

    switchBottomTab("console-view");
    appendConsole(`\n--- Running [${lesson ? lesson.filename : 'script'}] (${new Date().toLocaleTimeString()}) ---`, "system");

    const startTime = performance.now();
    const { stdout, stderr, result } = await window.SmartCodeRunner.execute(code, language);
    const duration = (performance.now() - startTime).toFixed(1);

    if (stdout) {
      appendConsole(stdout, "stdout");
    }
    if (stderr) {
      appendConsole(stderr, "stderr");
    }

    appendConsole(`\n[Execution Finished in ${duration}ms]`, "system");

    // If SQL, also update SQL Visualizer Table
    if (language === "sql" && Array.isArray(result)) {
      renderSQLTable(result);
    }

    // Run automated tests
    if (lesson && lesson.tests) {
      const testResults = window.SmartCodeRunner.runTests(lesson.tests, stdout, code, result);
      renderTestResults(testResults);

      const allPassed = testResults.every(t => t.passed);
      if (allPassed) {
        els.testsBadge.textContent = "All Passed";
        els.testsBadge.className = "badge-mini test-status-badge passed";
        if (isSubmit) {
          if (!state.completedLessons.has(lesson.id)) {
            state.completedLessons.add(lesson.id);
            state.userXP += 50;
            els.xpDisplay.textContent = state.userXP;
            showToast("🎉 Perfect! Solution Accepted (+50 XP)!", "success");
            renderLessonsList();
          } else {
            showToast("Solution verified! All tests passed.", "success");
          }
        }
      } else {
        els.testsBadge.textContent = "Tests Failed";
        els.testsBadge.className = "badge-mini test-status-badge failed";
        if (isSubmit) {
          switchBottomTab("test-runner-view");
          showToast("Some tests failed. Check the Test Cases tab for details.", "error");
        }
      }
    }
  }

  function appendConsole(text, type = "stdout") {
    const line = document.createElement("div");
    line.className = `console-line ${type}`;
    line.textContent = text;
    els.consoleOutput.appendChild(line);
    els.consoleOutput.scrollTop = els.consoleOutput.scrollHeight;
  }

  els.btnClearConsole.addEventListener("click", () => {
    els.consoleOutput.innerHTML = '<div class="console-welcome"><span class="welcome-badge">Console Cleared</span></div>';
  });

  // ----------------------------------------------------
  // Bottom Panel Tab Switching
  // ----------------------------------------------------
  els.bottomTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-target");
      switchBottomTab(targetId);
    });
  });

  function switchBottomTab(viewId) {
    els.bottomTabs.forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-target") === viewId);
    });
    els.bottomViews.forEach(v => {
      v.classList.toggle("active", v.id === viewId);
    });
  }

  els.btnToggleBottom.addEventListener("click", () => {
    els.bottomPanel.classList.toggle("collapsed");
  });

  // Render Test Results Cards
  function renderTestResults(results) {
    if (!results || results.length === 0) {
      els.testsContainer.innerHTML = '<div class="tests-empty">No tests available for this snippet.</div>';
      return;
    }

    els.testsContainer.innerHTML = "";
    results.forEach((res, i) => {
      const card = document.createElement("div");
      card.className = `test-card ${res.passed ? 'passed' : 'failed'}`;
      card.innerHTML = `
        <div class="test-header">
          <span class="test-title">
            <i class="fa-solid ${res.passed ? 'fa-check text-success' : 'fa-xmark text-danger'}"></i>
            Test ${i + 1}: ${res.name}
          </span>
          <span class="test-status-tag ${res.passed ? 'passed' : 'failed'}">
            ${res.passed ? 'Passed' : 'Failed'}
          </span>
        </div>
        <div class="test-detail">${res.message}</div>
      `;
      els.testsContainer.appendChild(card);
    });
  }

  // Render SQL Table Visualizer
  function renderSQLTable(data) {
    if (!data || data.length === 0) {
      els.sqlTableContainer.innerHTML = '<div class="sql-empty-prompt">Query executed successfully (0 rows affected/returned).</div>';
      return;
    }

    const columns = Object.keys(data[0]);
    let tableHtml = '<table class="sql-data-table"><thead><tr>';
    columns.forEach(col => {
      tableHtml += `<th>${col}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    data.forEach(row => {
      tableHtml += '<tr>';
      columns.forEach(col => {
        tableHtml += `<td>${row[col] !== undefined ? row[col] : 'NULL'}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    els.sqlTableContainer.innerHTML = tableHtml;
  }

  // ----------------------------------------------------
  // Workspace File Explorer & File Creation
  // ----------------------------------------------------
  function renderExplorerTree() {
    els.explorerTree.innerHTML = "";
    state.workspaceFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = `file-tree-item ${state.activeFileName === file.name ? 'active' : ''}`;

      const iconClass = file.language === "python" ? "fa-brands fa-python" :
                       (file.language === "javascript" ? "fa-brands fa-js" :
                       (file.language === "sql" ? "fa-solid fa-database" :
                       (file.language === "html" ? "fa-brands fa-html5" :
                       (file.language === "css" ? "fa-brands fa-css3-alt" : "fa-solid fa-file-code"))));

      item.innerHTML = `
        <div class="file-tree-left">
          <i class="${iconClass}"></i>
          <span>${file.name}</span>
        </div>
        <button class="file-delete-btn" title="Delete File" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;

      // Select and open file
      item.addEventListener("click", (e) => {
        if (e.target.closest(".file-delete-btn")) return;
        openWorkspaceFile(file);
      });

      // Delete file
      const deleteBtn = item.querySelector(".file-delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteWorkspaceFile(index);
        });
      }

      els.explorerTree.appendChild(item);
    });
  }

  function openWorkspaceFile(file) {
    saveCurrentBuffer();
    state.activeFileName = file.name;
    document.querySelectorAll(".file-tree-item").forEach(el => el.classList.remove("active"));
    const activeItem = Array.from(els.explorerTree.children).find(el => el.textContent.includes(file.name));
    if (activeItem) activeItem.classList.add("active");

    els.currentFileLabel.textContent = file.name;
    if (window.SmartCodeAI && window.SmartCodeAI.updateContextFileName) {
      window.SmartCodeAI.updateContextFileName(file.name);
    }
    const iconClass = file.language === "python" ? "fa-brands fa-python" :
                     (file.language === "javascript" ? "fa-brands fa-js" :
                     (file.language === "sql" ? "fa-solid fa-database" : "fa-solid fa-file-code"));
    els.currentTabIcon.className = `${iconClass} tab-icon`;

    window.SmartCodeEditor.setLanguageAndCode(file.language, file.content);
    switchMode("playground");
  }

  function deleteWorkspaceFile(index) {
    const file = state.workspaceFiles[index];
    if (!file) return;

    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      state.workspaceFiles.splice(index, 1);
      persistWorkspaceFiles();
      renderExplorerTree();
      showToast(`Deleted "${file.name}"`, "info");

      // If deleted file was currently open, switch to the first available file
      if (state.activeFileName === file.name) {
        if (state.workspaceFiles.length > 0) {
          openWorkspaceFile(state.workspaceFiles[0]);
        } else {
          loadTrack(state.currentTrack, 0);
        }
      }
    }
  }

  function saveCurrentBuffer() {
    if (state.activeFileName && window.SmartCodeEditor && window.SmartCodeEditor.editor) {
      const currentCode = window.SmartCodeEditor.editor.getValue();
      const currentFile = state.workspaceFiles.find(f => f.name === state.activeFileName);
      if (currentFile) {
        currentFile.content = currentCode;
        persistWorkspaceFiles();
      }
    }
  }

  // Auto-save current buffer on editor content changes
  setInterval(() => {
    saveCurrentBuffer();
  }, 2000);

  // New File Creation Handlers
  function showNewFileInput() {
    // Ensure Explorer panel is visible
    if (els.sidePanel.classList.contains("collapsed")) {
      els.sidePanel.classList.remove("collapsed");
    }
    els.activityBtns.forEach(b => b.classList.remove("active"));
    const actExplorer = document.getElementById("act-explorer");
    if (actExplorer) actExplorer.classList.add("active");

    els.sidePanels.forEach(p => p.classList.toggle("active", p.id === "panel-explorer"));

    // Show input box
    if (els.newFileBox) {
      els.newFileBox.style.display = "block";
      if (els.newFileInput) {
        els.newFileInput.value = "";
        els.newFileInput.focus();
      }
    }
  }

  function hideNewFileInput() {
    if (els.newFileBox) {
      els.newFileBox.style.display = "none";
      if (els.newFileInput) els.newFileInput.value = "";
    }
  }

  function handleCreateNewFile() {
    if (!els.newFileInput) return;
    let fileName = els.newFileInput.value.trim();

    if (!fileName) {
      const num = state.workspaceFiles.length + 1;
      fileName = `script_${num}.py`;
    }

    // Ensure valid filename format
    fileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

    // If no extension, append based on current track
    if (!fileName.includes(".")) {
      const extMap = { python: ".py", javascript: ".js", sql: ".sql" };
      fileName += extMap[state.currentTrack] || ".py";
    }

    // Check for duplicate name
    if (state.workspaceFiles.some(f => f.name.toLowerCase() === fileName.toLowerCase())) {
      showToast(`A file named "${fileName}" already exists!`, "error");
      els.newFileInput.focus();
      return;
    }

    // Detect language from extension
    const language = detectLanguageFromFileName(fileName);

    // Starter template based on language
    const starterTemplates = {
      python: `# Python Scratchpad: ${fileName}\ndef main():\n    print("Hello from ${fileName}!")\n\nif __name__ == "__main__":\n    main()\n`,
      javascript: `// JavaScript Scratchpad: ${fileName}\nfunction main() {\n  console.log("Hello from ${fileName}!");\n}\n\nmain();\n`,
      sql: `-- SQL Scratchpad: ${fileName}\nSELECT * FROM employees WHERE department = 'Engineering';\n`,
      html: `<!DOCTYPE html>\n<html>\n<head><title>${fileName}</title></head>\n<body>\n  <h1>Hello from ${fileName}</h1>\n</body>\n</html>\n`,
      css: `/* CSS Scratchpad: ${fileName} */\nbody {\n  background: #111;\n  color: #fff;\n}\n`
    };

    const newFile = {
      name: fileName,
      language: language,
      content: starterTemplates[language] || starterTemplates.python
    };

    state.workspaceFiles.push(newFile);
    persistWorkspaceFiles();
    hideNewFileInput();
    renderExplorerTree();
    openWorkspaceFile(newFile);
    showToast(`Created new file "${fileName}"!`, "success");
  }

  function detectLanguageFromFileName(fileName) {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".py")) return "python";
    if (lower.endsWith(".js") || lower.endsWith(".mjs") || lower.endsWith(".ts")) return "javascript";
    if (lower.endsWith(".sql")) return "sql";
    if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
    if (lower.endsWith(".css")) return "css";
    return state.currentTrack || "python";
  }

  if (els.btnNewFile) {
    els.btnNewFile.addEventListener("click", showNewFileInput);
  }

  if (els.btnNewTab) {
    els.btnNewTab.addEventListener("click", showNewFileInput);
  }

  if (els.btnConfirmNewFile) {
    els.btnConfirmNewFile.addEventListener("click", handleCreateNewFile);
  }

  if (els.btnCancelNewFile) {
    els.btnCancelNewFile.addEventListener("click", hideNewFileInput);
  }

  if (els.newFileInput) {
    els.newFileInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCreateNewFile();
      } else if (e.key === "Escape") {
        e.preventDefault();
        hideNewFileInput();
      }
    });
  }

  // ----------------------------------------------------
  // Fullscreen Editor Toggle
  // ----------------------------------------------------
  if (els.btnEditorExpand) {
    els.btnEditorExpand.addEventListener("click", toggleFullscreenEditor);
  }

  function toggleFullscreenEditor() {
    if (!els.codeEditorWrapper) return;
    const isFullscreen = els.codeEditorWrapper.classList.toggle("fullscreen-mode");
    const icon = els.btnEditorExpand.querySelector("i");

    if (isFullscreen) {
      if (icon) icon.className = "fa-solid fa-compress";
      els.btnEditorExpand.title = "Exit Fullscreen (Esc)";
      showToast("Fullscreen Editor Active (Press Esc to exit)", "info");
    } else {
      if (icon) icon.className = "fa-solid fa-expand";
      els.btnEditorExpand.title = "Toggle Fullscreen Editor";
      showToast("Exited Fullscreen", "info");
    }

    // Trigger Monaco editor layout recalculation
    setTimeout(() => {
      if (window.SmartCodeEditor && window.SmartCodeEditor.editor) {
        window.SmartCodeEditor.editor.layout();
      }
    }, 120);
  }

  // ----------------------------------------------------
  // Interactive Quizzes Panel
  // ----------------------------------------------------
  function renderChallenges() {
    els.challengesList.innerHTML = "";
    CHALLENGES.forEach((q, idx) => {
      const box = document.createElement("div");
      box.className = "test-card";
      box.style.marginBottom = "14px";
      box.innerHTML = `
        <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
          Q${idx + 1}. ${q.question}
        </div>
        <div class="quiz-options" style="display: flex; flex-direction: column; gap: 6px;">
          ${q.options.map((opt, optIdx) => `
            <button class="btn-action btn-secondary quiz-opt-btn" data-qid="${q.id}" data-opt="${optIdx}" style="text-align: left; justify-content: flex-start; font-size: 12px; padding: 6px 10px;">
              ${opt}
            </button>
          `).join("")}
        </div>
        <div id="quiz-feedback-${q.id}" style="margin-top: 8px; font-size: 12px; display: none;"></div>
      `;

      box.querySelectorAll(".quiz-opt-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const optIndex = parseInt(btn.getAttribute("data-opt"));
          const fb = document.getElementById(`quiz-feedback-${q.id}`);
          fb.style.display = "block";

          if (optIndex === q.answer) {
            btn.style.borderColor = "var(--color-success)";
            btn.style.background = "var(--color-success-bg)";
            fb.innerHTML = `<span style="color: var(--color-success); font-weight: 600;">✓ Correct!</span> ${q.explanation}`;
            if (!state.userAnswers[q.id]) {
              state.userAnswers[q.id] = true;
              state.userXP += 25;
              els.xpDisplay.textContent = state.userXP;
              showToast("Quiz Answer Correct! (+25 XP)", "success");
            }
          } else {
            btn.style.borderColor = "var(--color-danger)";
            fb.innerHTML = `<span style="color: var(--color-danger); font-weight: 600;">✗ Incorrect.</span> Try again!`;
          }
        });
      });

      els.challengesList.appendChild(box);
    });
  }

  // ----------------------------------------------------
  // Documentation / IntelliSense Quick Reference
  // ----------------------------------------------------
  function renderDocs() {
    const lang = state.currentTrack;
    if (lang === "python") {
      els.docsContent.innerHTML = `
        <h4>Python 3 IntelliSense Quick Reference</h4>
        <p>Built-in snippets & typing helpers active:</p>
        <div class="docs-code-sample">def function_name(args):\n    return result</div>
        <div class="docs-code-sample">[x for x in seq if cond]</div>
        <div class="docs-code-sample">print(f"Val: {val}")</div>
        <h4>Indentation Rules</h4>
        <p>PEP 8 standard requires 4 spaces for block indentation. The editor will automatically indent after a colon <code>:</code>.</p>
      `;
    } else if (lang === "sql") {
      els.docsContent.innerHTML = `
        <h4>SQL Database Quick Reference</h4>
        <p>Standard SQL syntax queries loaded tables:</p>
        <div class="docs-code-sample">SELECT col1, col2\nFROM employees\nWHERE salary > 90000;</div>
        <div class="docs-code-sample">GROUP BY department\nHAVING COUNT(*) > 1</div>
        <h4>Interactive AlaSQL Database</h4>
        <p>Query results are automatically parsed into the interactive SQL Table visualizer tab.</p>
      `;
    } else {
      els.docsContent.innerHTML = `
        <h4>JavaScript ES2023 Reference</h4>
        <p>Array transformation shortcuts:</p>
        <div class="docs-code-sample">const res = arr.map(x => x * 2);</div>
        <div class="docs-code-sample">const evens = arr.filter(x => x % 2 === 0);</div>
      `;
    }
  }

  // ----------------------------------------------------
  // Draggable Splitters / Panel Resizers
  // ----------------------------------------------------
  function setupResizers() {
    let isDragging = false;
    let currentResizer = null;

    function onMouseDown(e, resizer) {
      isDragging = true;
      currentResizer = resizer;
      resizer.classList.add("dragging");
      document.body.style.userSelect = "none";
    }

    if (els.resizerSidebar) {
      els.resizerSidebar.addEventListener("mousedown", (e) => onMouseDown(e, els.resizerSidebar));
    }
    if (els.resizerLesson) {
      els.resizerLesson.addEventListener("mousedown", (e) => onMouseDown(e, els.resizerLesson));
    }
    if (els.resizerBottom) {
      els.resizerBottom.addEventListener("mousedown", (e) => onMouseDown(e, els.resizerBottom));
    }

    document.addEventListener("mousemove", (e) => {
      if (!isDragging || !currentResizer) return;

      if (currentResizer === els.resizerSidebar) {
        const newWidth = Math.max(180, Math.min(e.clientX - 54, 500));
        els.sidePanel.style.width = `${newWidth}px`;
      } else if (currentResizer === els.resizerLesson) {
        const sidebarWidth = els.sidePanel.classList.contains("collapsed") ? 0 : els.sidePanel.offsetWidth;
        const newWidth = Math.max(240, Math.min(e.clientX - (sidebarWidth + 54), 600));
        els.lessonPane.style.width = `${newWidth}px`;
      } else if (currentResizer === els.resizerBottom) {
        const newHeight = Math.max(100, Math.min(window.innerHeight - e.clientY - 28, 500));
        els.bottomPanel.style.height = `${newHeight}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        if (currentResizer) currentResizer.classList.remove("dragging");
        currentResizer = null;
        document.body.style.userSelect = "";
      }
    });
  }

  // Keyboard Shortcuts
  function setupShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl + Enter to Run Code
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCodeAction(false);
      }
      // Ctrl + N to Create New File
      if ((e.ctrlKey || e.metaKey) && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        showNewFileInput();
      }
      // Shift + Alt + F to Format
      if (e.shiftKey && e.altKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        window.SmartCodeEditor.formatCode();
      }
      // Escape to Exit Fullscreen or dismiss New File Box
      if (e.key === "Escape") {
        if (els.codeEditorWrapper && els.codeEditorWrapper.classList.contains("fullscreen-mode")) {
          toggleFullscreenEditor();
        } else if (els.newFileBox && els.newFileBox.style.display !== "none") {
          hideNewFileInput();
        }
      }
    });
  }

  // Toast Notification System
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "fa-circle-check" : (type === "error" ? "fa-triangle-exclamation" : "fa-circle-info");
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
