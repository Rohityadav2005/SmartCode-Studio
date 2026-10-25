/**
 * SmartCode Studio - Dedicated Quiz Arena Controller
 * Manages 30-question level progression, immediate Socratic explanations,
 * question navigation matrix, and awarding +30 XP upon 30/30 completion.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentLevelIndex: 0,
    currentQuestionIndex: 0,
    userAnswers: {}, // key: qid -> { selected: index, isCorrect: boolean }
    levelRewarded: {}, // key: levelId -> boolean
    userXP: loadUserXP()
  };

  // Cache DOM Elements
  const els = {
    headerXP: document.getElementById("quiz-user-xp"),
    levelTabsGroup: document.getElementById("level-tabs-group"),
    levelTitle: document.getElementById("level-title"),
    levelDesc: document.getElementById("level-desc"),
    levelBadge: document.getElementById("level-badge"),
    questionNumTag: document.getElementById("question-num-tag"),
    questionCategoryBadge: document.getElementById("question-category-badge"),
    questionPrompt: document.getElementById("question-prompt"),
    codeSnippetBox: document.getElementById("code-snippet-box"),
    optionsList: document.getElementById("options-list"),
    explanationBox: document.getElementById("explanation-box"),
    explanationHeader: document.getElementById("explanation-header"),
    explanationText: document.getElementById("explanation-text"),
    btnPrev: document.getElementById("btn-prev-q"),
    btnNext: document.getElementById("btn-next-q"),
    questionsGrid: document.getElementById("questions-grid"),
    progressBarFill: document.getElementById("progress-bar-fill"),
    progressText: document.getElementById("progress-text"),
    accuracyText: document.getElementById("accuracy-text"),
    completionModal: document.getElementById("completion-modal"),
    modalScoreSummary: document.getElementById("modal-score-summary"),
    btnClaimXP: document.getElementById("btn-claim-xp")
  };

  // 1. Initial Setup
  initLevelSelector();
  loadLevel(state.currentLevelIndex);
  updateHeaderXPDisplay();

  function loadUserXP() {
    const saved = localStorage.getItem("smartcode_user_xp");
    return saved ? parseInt(saved, 10) : 140;
  }

  function saveUserXP(newXP) {
    state.userXP = newXP;
    localStorage.setItem("smartcode_user_xp", String(newXP));
    updateHeaderXPDisplay();
  }

  function updateHeaderXPDisplay() {
    if (els.headerXP) {
      els.headerXP.textContent = state.userXP;
    }
  }

  // 2. Level Tabs Initialization
  function initLevelSelector() {
    els.levelTabsGroup.innerHTML = "";
    QUIZ_LEVELS.forEach((level, idx) => {
      const btn = document.createElement("button");
      btn.className = `level-tab-btn ${idx === state.currentLevelIndex ? 'active' : ''}`;
      btn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Level ${idx + 1} (${level.questions.length} Qs)`;

      btn.addEventListener("click", () => {
        document.querySelectorAll(".level-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadLevel(idx);
      });

      els.levelTabsGroup.appendChild(btn);
    });
  }

  // 3. Load Level Data
  function loadLevel(levelIndex) {
    state.currentLevelIndex = levelIndex;
    state.currentQuestionIndex = 0;

    const level = QUIZ_LEVELS[levelIndex];
    if (!level) return;

    // Load persisted answers for this level
    const savedKey = `smartcode_quiz_answers_${level.id}`;
    const savedAnswers = localStorage.getItem(savedKey);
    state.userAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};

    // Check if level was previously rewarded
    const rewardKey = `smartcode_quiz_rewarded_${level.id}`;
    state.levelRewarded[level.id] = localStorage.getItem(rewardKey) === "true";

    // Update Header Meta
    if (els.levelTitle) els.levelTitle.textContent = level.name;
    if (els.levelDesc) els.levelDesc.textContent = level.description;
    if (els.levelBadge) els.levelBadge.textContent = level.badge;

    renderQuestionsGrid();
    renderCurrentQuestion();
    updateProgressStats();
  }

  // 4. Render 30-Question Matrix in Sidebar
  function renderQuestionsGrid() {
    const level = QUIZ_LEVELS[state.currentLevelIndex];
    els.questionsGrid.innerHTML = "";

    level.questions.forEach((q, idx) => {
      const cell = document.createElement("button");
      cell.className = "grid-cell-btn";
      cell.textContent = idx + 1;

      // Status styling
      const ans = state.userAnswers[q.id];
      if (ans) {
        cell.classList.add(ans.isCorrect ? "correct" : "incorrect");
      }
      if (idx === state.currentQuestionIndex) {
        cell.classList.add("active");
      }

      cell.addEventListener("click", () => {
        state.currentQuestionIndex = idx;
        renderCurrentQuestion();
        updateActiveGridCell();
      });

      els.questionsGrid.appendChild(cell);
    });
  }

  function updateActiveGridCell() {
    const cells = els.questionsGrid.querySelectorAll(".grid-cell-btn");
    cells.forEach((cell, idx) => {
      cell.classList.toggle("active", idx === state.currentQuestionIndex);
    });
  }

  // 5. Render Active Question
  function renderCurrentQuestion() {
    const level = QUIZ_LEVELS[state.currentLevelIndex];
    const q = level.questions[state.currentQuestionIndex];
    if (!q) return;

    els.questionNumTag.textContent = `Question ${state.currentQuestionIndex + 1} of ${level.questions.length}`;
    els.questionCategoryBadge.textContent = `Level ${state.currentLevelIndex + 1} • QID #${q.id}`;
    els.questionPrompt.textContent = q.question;

    // Code snippet
    if (q.code) {
      els.codeSnippetBox.style.display = "block";
      els.codeSnippetBox.textContent = q.code;
    } else {
      els.codeSnippetBox.style.display = "none";
    }

    // Previous answer state
    const savedAns = state.userAnswers[q.id];

    // Options
    els.optionsList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      if (savedAns) btn.classList.add("locked");

      // Colorize if answered
      if (savedAns) {
        if (optIdx === q.answer) {
          btn.classList.add("correct");
        } else if (savedAns.selected === optIdx && !savedAns.isCorrect) {
          btn.classList.add("incorrect");
        }
      }

      btn.innerHTML = `
        <span class="option-letter">${letters[optIdx]}</span>
        <span class="option-label">${optText}</span>
      `;

      btn.addEventListener("click", () => {
        handleOptionSelect(q, optIdx);
      });

      els.optionsList.appendChild(btn);
    });

    // Explanation
    if (savedAns) {
      showExplanation(savedAns.isCorrect, q.explanation);
    } else {
      els.explanationBox.style.display = "none";
    }

    // Navigation buttons state
    els.btnPrev.disabled = state.currentQuestionIndex === 0;
    els.btnPrev.style.opacity = state.currentQuestionIndex === 0 ? "0.4" : "1";

    const isLast = state.currentQuestionIndex === level.questions.length - 1;
    els.btnNext.innerHTML = isLast ? 'Finish Level <i class="fa-solid fa-trophy"></i>' : 'Next <i class="fa-solid fa-arrow-right"></i>';

    updateActiveGridCell();
  }

  // 6. Handle User Selection
  function handleOptionSelect(question, selectedIdx) {
    // If already answered, allow re-inspection without double penalty
    const isCorrect = selectedIdx === question.answer;

    state.userAnswers[question.id] = {
      selected: selectedIdx,
      isCorrect: isCorrect
    };

    // Persist answers
    const level = QUIZ_LEVELS[state.currentLevelIndex];
    localStorage.setItem(`smartcode_quiz_answers_${level.id}`, JSON.stringify(state.userAnswers));

    // Re-render options & explanation
    renderCurrentQuestion();
    renderQuestionsGrid();
    updateProgressStats();

    // Check for 30/30 level completion!
    checkLevelCompletion(level);
  }

  function showExplanation(isCorrect, text) {
    els.explanationBox.style.display = "block";
    els.explanationHeader.className = `explanation-header ${isCorrect ? 'correct' : 'incorrect'}`;
    els.explanationHeader.innerHTML = isCorrect
      ? '<i class="fa-solid fa-circle-check"></i> Correct Answer!'
      : '<i class="fa-solid fa-circle-xmark"></i> Incorrect. Review the concept below:';
    els.explanationText.textContent = text;
  }

  // 7. Update Progress & Accuracy
  function updateProgressStats() {
    const level = QUIZ_LEVELS[state.currentLevelIndex];
    const total = level.questions.length;
    let completedCount = 0;
    let correctCount = 0;

    level.questions.forEach(q => {
      const ans = state.userAnswers[q.id];
      if (ans !== undefined) {
        completedCount++;
        if (ans.isCorrect) correctCount++;
      }
    });

    const percent = Math.round((completedCount / total) * 100);
    els.progressBarFill.style.width = `${percent}%`;
    els.progressText.textContent = `${completedCount} / ${total} Answered`;

    const accuracy = completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;
    els.accuracyText.textContent = `${accuracy}% Accuracy (${correctCount} Correct)`;
  }

  // 8. 30-Question Level Completion & Awarding +30 XP
  function checkLevelCompletion(level) {
    const total = level.questions.length;
    const answeredCount = Object.keys(state.userAnswers).length;

    // Trigger when all 30 questions are completed
    if (answeredCount >= total && !state.levelRewarded[level.id]) {
      state.levelRewarded[level.id] = true;
      localStorage.setItem(`smartcode_quiz_rewarded_${level.id}`, "true");

      // Award +30 XP to Profile
      const newXP = state.userXP + level.xpReward;
      saveUserXP(newXP);

      // Calculate score summary
      let correct = 0;
      level.questions.forEach(q => {
        if (state.userAnswers[q.id]?.isCorrect) correct++;
      });
      const pct = Math.round((correct / total) * 100);

      els.modalScoreSummary.innerHTML = `
        You answered <strong>${correct} of ${total}</strong> questions correctly (<strong>${pct}%</strong>).<br>
        <strong>+30 XP</strong> has been credited to your developer profile!
      `;

      // Trigger Celebration Modal
      setTimeout(() => {
        els.completionModal.style.display = "flex";
      }, 500);
    }
  }

  // Close Modal Handler
  if (els.btnClaimXP) {
    els.btnClaimXP.addEventListener("click", () => {
      els.completionModal.style.display = "none";
      // Switch to next level if available
      if (state.currentLevelIndex < QUIZ_LEVELS.length - 1) {
        document.querySelectorAll(".level-tab-btn")[state.currentLevelIndex + 1]?.click();
      }
    });
  }

  // 9. Navigation Buttons
  els.btnPrev.addEventListener("click", () => {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderCurrentQuestion();
    }
  });

  els.btnNext.addEventListener("click", () => {
    const level = QUIZ_LEVELS[state.currentLevelIndex];
    if (state.currentQuestionIndex < level.questions.length - 1) {
      state.currentQuestionIndex++;
      renderCurrentQuestion();
    } else {
      // Re-evaluate level completion
      checkLevelCompletion(level);
    }
  });

  // Keyboard Navigation: Arrow Left/Right
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      els.btnNext.click();
    } else if (e.key === "ArrowLeft") {
      els.btnPrev.click();
    }
  });
});
