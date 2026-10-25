/**
 * SmartCode Studio - AI Assistant Module (Powered by Qwen2.5-Coder:3b)
 * Real-time streaming assistant with editor context integration.
 */

window.SmartCodeAI = (function () {
  const MODEL_NAME = "qwen2.5-coder:3b";
  const API_ENDPOINT = "/api/chat";

  let conversation = [
    {
      role: "assistant",
      content: "Hello! I am your **Qwen2.5-Coder** assistant. I have live visibility into your active editor code. You can ask me to debug errors, explain logic, optimize code, or guide you through lessons."
    }
  ];

  let isStreaming = false;
  let abortController = null;

  // DOM elements cache
  const els = {
    tabNavAi: null,
    tabNavLesson: null,
    aiView: null,
    lessonView: null,
    chatFeed: null,
    promptInput: null,
    btnSend: null,
    btnStop: null,
    btnClear: null,
    includeCodeCheck: null,
    contextFile: null,
    modelTag: null,
    quickChips: null
  };

  function init() {
    els.tabNavAi = document.getElementById("tab-nav-ai");
    els.tabNavLesson = document.getElementById("tab-nav-lesson");
    els.aiView = document.getElementById("ai-view-container");
    els.lessonView = document.getElementById("lesson-view-container");
    els.chatFeed = document.getElementById("ai-chat-feed");
    els.promptInput = document.getElementById("ai-prompt-input");
    els.btnSend = document.getElementById("btn-ai-send");
    els.btnStop = document.getElementById("btn-ai-stop");
    els.btnClear = document.getElementById("btn-clear-ai");
    els.includeCodeCheck = document.getElementById("ai-include-code");
    els.contextFile = document.getElementById("ai-context-file");
    els.modelTag = document.getElementById("current-ai-model");
    els.quickChips = document.querySelectorAll(".ai-chip");

    if (!els.promptInput) return;

    setupTabNavigation();
    setupChatEvents();
    setupQuickChips();
    updateContextFileName();
    attachExistingMessageActions();
  }

  function setupTabNavigation() {
    if (els.tabNavAi && els.tabNavLesson) {
      els.tabNavAi.addEventListener("click", () => {
        els.tabNavAi.classList.add("active");
        els.tabNavLesson.classList.remove("active");
        if (els.aiView) els.aiView.classList.remove("hidden");
        if (els.lessonView) els.lessonView.classList.add("hidden");
      });

      els.tabNavLesson.addEventListener("click", () => {
        els.tabNavLesson.classList.add("active");
        els.tabNavAi.classList.remove("active");
        if (els.lessonView) els.lessonView.classList.remove("hidden");
        if (els.aiView) els.aiView.classList.add("hidden");
      });
    }
  }

  function setupQuickChips() {
    if (!els.quickChips) return;
    els.quickChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const prompt = chip.getAttribute("data-prompt");
        if (prompt && !isStreaming) {
          sendUserMessage(prompt);
        }
      });
    });
  }

  function setupChatEvents() {
    // Send button
    if (els.btnSend) {
      els.btnSend.addEventListener("click", () => {
        submitInput();
      });
    }

    // Stop button
    if (els.btnStop) {
      els.btnStop.addEventListener("click", () => {
        stopStreaming();
      });
    }

    // Clear button
    if (els.btnClear) {
      els.btnClear.addEventListener("click", () => {
        clearChat();
      });
    }

    // Textarea Enter key, auto-expand, and send button active state
    if (els.promptInput) {
      els.promptInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submitInput();
        }
      });

      els.promptInput.addEventListener("input", () => {
        els.promptInput.style.height = "auto";
        els.promptInput.style.height = Math.min(els.promptInput.scrollHeight, 120) + "px";
        if (els.btnSend) {
          els.btnSend.classList.toggle("active", els.promptInput.value.trim().length > 0);
        }
      });
    }

    // Review Changes button
    const btnReview = document.getElementById("btn-review-changes");
    if (btnReview) {
      btnReview.addEventListener("click", () => {
        if (window.SmartCodeEditor && window.SmartCodeEditor.editor) {
          window.SmartCodeEditor.editor.focus();
        }
        if (window.showToast) {
          const file = els.contextFile ? els.contextFile.textContent : "solution.py";
          window.showToast(`Reviewing changes in active editor tab (${file})`, "info");
        }
      });
    }

    // Voice Microphone button
    const btnMic = document.getElementById("btn-ai-mic");
    if (btnMic) {
      btnMic.addEventListener("click", () => {
        if (window.showToast) {
          window.showToast("Voice input active. Speak your coding question...", "info");
        }
      });
    }

    // Plus Add Context button
    const btnPlus = document.getElementById("btn-ai-plus");
    if (btnPlus) {
      btnPlus.addEventListener("click", () => {
        if (els.promptInput) {
          els.promptInput.value = (els.promptInput.value ? els.promptInput.value + " " : "") + "@";
          els.promptInput.focus();
          if (els.btnSend) els.btnSend.classList.add("active");
        }
      });
    }
  }

  function submitInput() {
    if (isStreaming) return;
    const text = els.promptInput.value.trim();
    if (!text) return;
    els.promptInput.value = "";
    els.promptInput.style.height = "auto";
    if (els.btnSend) els.btnSend.classList.remove("active");
    sendUserMessage(text);
  }

  function clearChat() {
    conversation = [];
    if (els.chatFeed) {
      els.chatFeed.innerHTML = "";
      appendMessage("assistant", "Chat history cleared. How can I assist you with your code?");
    }
  }

  function updateContextFileName(filename) {
    if (!els.contextFile) return;
    if (filename) {
      els.contextFile.textContent = filename;
    } else {
      const activeTab = document.querySelector("#editor-tabs .tab-item.active .tab-label");
      if (activeTab) {
        els.contextFile.textContent = activeTab.textContent;
      }
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function attachExistingMessageActions() {
    if (!els.chatFeed) return;
    els.chatFeed.querySelectorAll(".ai-assistant-wrapper").forEach(wrapper => {
      attachCodeBlockButtons(wrapper);
      attachMessageActions(wrapper);
    });
  }

  function attachMessageActions(container) {
    // Copy entire response button
    container.querySelectorAll(".btn-copy-msg").forEach(btn => {
      btn.onclick = () => {
        const contentEl = container.querySelector(".ai-msg-content");
        if (!contentEl) return;
        const text = contentEl.innerText || contentEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
          if (window.showToast) window.showToast("Response copied to clipboard", "success");
        });
      };
    });

    // Helpful / Not helpful feedback
    container.querySelectorAll(".btn-thumb-up, .btn-thumb-down").forEach(btn => {
      btn.onclick = () => {
        const isUp = btn.classList.contains("btn-thumb-up");
        btn.style.color = isUp ? "#38bdf8" : "#f87171";
        if (window.showToast) {
          window.showToast(isUp ? "Feedback noted: Helpful!" : "Feedback noted: Needs improvement", "info");
        }
      };
    });
  }

  function renderMarkdown(content) {
    let html = escapeHtml(content);

    // Code blocks with syntax: ```lang \n code \n ```
    html = html.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const displayLang = lang.trim() || "code";
      return `
        <div class="msg-code-block">
          <div class="code-block-header">
            <span><i class="fa-solid fa-code"></i> ${displayLang}</span>
            <div class="code-block-actions">
              <button class="code-btn btn-copy-code" data-code="${encodeURIComponent(code)}">
                <i class="fa-regular fa-copy"></i> Copy
              </button>
              <button class="code-btn btn-insert-code" data-code="${encodeURIComponent(code)}" title="Insert code into editor">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> Insert
              </button>
            </div>
          </div>
          <pre><code>${code}</code></pre>
        </div>
      `;
    });

    // Inline code: `code` -> <code class="code-pill">$1</code>
    html = html.replace(/`([^`]+)`/g, '<code class="code-pill">$1</code>');

    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Italic: *text*
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Line by line processing for bullet lists and headings
    const lines = html.split("\n");
    let inList = false;
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList) {
          processedLines.push("<ul>");
          inList = true;
        }
        processedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          processedLines.push("</ul>");
          inList = false;
        }
        if (trimmed.startsWith("### ")) {
          processedLines.push(`<h4>${trimmed.substring(4)}</h4>`);
        } else if (trimmed.startsWith("## ")) {
          processedLines.push(`<h3>${trimmed.substring(3)}</h3>`);
        } else if (trimmed.startsWith("# ")) {
          processedLines.push(`<h2>${trimmed.substring(2)}</h2>`);
        } else {
          processedLines.push(line);
        }
      }
    }
    if (inList) {
      processedLines.push("</ul>");
    }

    const reconstructed = processedLines.join("\n");
    const blocks = reconstructed.split(/\n\s*\n/);
    return blocks.map(block => {
      const b = block.trim();
      if (!b) return "";
      if (b.startsWith("<div class=\"msg-code-block\"") || b.startsWith("<ul>") || b.startsWith("<h")) {
        return b;
      }
      return `<p>${b.replace(/\n/g, "<br>")}</p>`;
    }).join("");
  }

  function attachCodeBlockButtons(container) {
    // Copy code button
    container.querySelectorAll(".btn-copy-code").forEach(btn => {
      btn.onclick = () => {
        const rawCode = decodeURIComponent(btn.getAttribute("data-code"));
        navigator.clipboard.writeText(rawCode).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
          setTimeout(() => { btn.innerHTML = original; }, 2000);
        });
      };
    });

    // Insert code into editor
    container.querySelectorAll(".btn-insert-code").forEach(btn => {
      btn.onclick = () => {
        const rawCode = decodeURIComponent(btn.getAttribute("data-code"));
        if (window.SmartCodeEditor && window.SmartCodeEditor.editor) {
          window.SmartCodeEditor.editor.setValue(rawCode);
          if (window.showToast) {
            window.showToast("Code inserted into active editor tab!", "success");
          }
        }
      };
    });
  }

  function appendMessage(role, text) {
    if (!els.chatFeed) return null;

    if (role === "user") {
      const userCard = document.createElement("div");
      userCard.className = "ai-user-card";
      userCard.textContent = text;
      els.chatFeed.appendChild(userCard);
      els.chatFeed.scrollTop = els.chatFeed.scrollHeight;
      return userCard;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "ai-assistant-wrapper";
    wrapper.innerHTML = `
      <div class="ai-msg-actions-hover">
        <button class="msg-action-btn btn-copy-msg" title="Copy"><i class="fa-regular fa-copy"></i></button>
        <button class="msg-action-btn btn-thumb-up" title="Helpful"><i class="fa-regular fa-thumbs-up"></i></button>
        <button class="msg-action-btn btn-thumb-down" title="Not helpful"><i class="fa-regular fa-thumbs-down"></i></button>
      </div>
      <div class="ai-process-badges">
        <div class="ai-process-pill">
          <span>Ready</span> <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
      <div class="ai-msg-content">${renderMarkdown(text)}</div>
    `;

    els.chatFeed.appendChild(wrapper);
    els.chatFeed.scrollTop = els.chatFeed.scrollHeight;
    attachCodeBlockButtons(wrapper);
    attachMessageActions(wrapper);
    return wrapper;
  }

  async function sendUserMessage(userPrompt) {
    if (isStreaming) return;

    let editorCode = "";
    let currentFileName = "solution.py";

    if (window.SmartCodeEditor && window.SmartCodeEditor.editor) {
      editorCode = window.SmartCodeEditor.editor.getValue();
    }
    const activeTab = document.querySelector("#editor-tabs .tab-item.active .tab-label");
    if (activeTab) currentFileName = activeTab.textContent;

    const includeCode = els.includeCodeCheck ? els.includeCodeCheck.checked : true;

    // Append user card matching reference design
    appendMessage("user", userPrompt);

    // Prepare message payload for Ollama
    const messagesPayload = [
      {
        role: "system",
        content: "You are Qwen2.5-Coder, an expert programming mentor inside SmartCode Studio IDE. Provide direct, concise, and helpful responses. Highlight file names, identifiers, and code using markdown inline code or fenced blocks. Format with structured bullets and headers."
      }
    ];

    if (includeCode && editorCode.trim().length > 0) {
      messagesPayload.push({
        role: "user",
        content: `Current File: ${currentFileName}\nActive Code in Editor:\n\`\`\`\n${editorCode}\n\`\`\`\n\nUser Question: ${userPrompt}`
      });
    } else {
      messagesPayload.push({
        role: "user",
        content: userPrompt
      });
    }

    // Create assistant message wrapper matching reference screenshot
    const assistantMsg = document.createElement("div");
    assistantMsg.className = "ai-assistant-wrapper";
    assistantMsg.innerHTML = `
      <div class="ai-msg-actions-hover">
        <button class="msg-action-btn btn-copy-msg" title="Copy"><i class="fa-regular fa-copy"></i></button>
        <button class="msg-action-btn btn-thumb-up" title="Helpful"><i class="fa-regular fa-thumbs-up"></i></button>
        <button class="msg-action-btn btn-thumb-down" title="Not helpful"><i class="fa-regular fa-thumbs-down"></i></button>
      </div>
      <div class="ai-process-badges">
        <div class="ai-process-pill ai-time-pill">
          <span>Working...</span> <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
      <div class="ai-msg-content"><span class="ai-stream-cursor"></span></div>
    `;
    els.chatFeed.appendChild(assistantMsg);
    els.chatFeed.scrollTop = els.chatFeed.scrollHeight;

    const textContainer = assistantMsg.querySelector(".ai-msg-content");
    const startTime = performance.now();

    // UI state: streaming
    setStreamingState(true);
    let fullResponse = "";

    try {
      abortController = new AbortController();
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: messagesPayload
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          try {
            const data = JSON.parse(trimmed.replace(/^data:\s*/, ""));
            if (data.token) {
              fullResponse += data.token;
              textContainer.innerHTML = renderMarkdown(fullResponse) + '<span class="ai-stream-cursor"></span>';
              els.chatFeed.scrollTop = els.chatFeed.scrollHeight;
            }
          } catch (e) {
            // ignore non-json line
          }
        }
      }

      // Final render without cursor
      textContainer.innerHTML = renderMarkdown(fullResponse);

      // Update process badges (Worked for Xs > and Run filename finished >)
      const elapsedSec = Math.max(1, Math.round((performance.now() - startTime) / 1000));
      const timePill = assistantMsg.querySelector(".ai-time-pill");
      if (timePill) {
        timePill.innerHTML = `<span>Worked for ${elapsedSec}s</span> <i class="fa-solid fa-chevron-right"></i>`;
      }
      const badgesContainer = assistantMsg.querySelector(".ai-process-badges");
      if (badgesContainer && includeCode && currentFileName) {
        const runPill = document.createElement("div");
        runPill.className = "ai-process-pill";
        runPill.innerHTML = `<span>Run ${currentFileName} finished</span> <i class="fa-solid fa-chevron-right"></i>`;
        badgesContainer.appendChild(runPill);
      }

      attachCodeBlockButtons(assistantMsg);
      attachMessageActions(assistantMsg);
      conversation.push({ role: "assistant", content: fullResponse });

    } catch (err) {
      if (err.name === "AbortError") {
        textContainer.innerHTML = renderMarkdown(fullResponse + " *(Generation stopped)*");
      } else {
        console.error("AI chat error:", err);
        textContainer.innerHTML = renderMarkdown(
          `*Note: Could not reach Qwen2.5-Coder directly (${err.message}). Make sure Ollama is running \`ollama run qwen2.5-coder:3b\`.*`
        );
      }
      attachCodeBlockButtons(assistantMsg);
      attachMessageActions(assistantMsg);
    } finally {
      setStreamingState(false);
      els.chatFeed.scrollTop = els.chatFeed.scrollHeight;
    }
  }

  function setStreamingState(streaming) {
    isStreaming = streaming;
    if (els.btnSend) {
      els.btnSend.classList.toggle("hidden", streaming);
      els.btnSend.style.display = streaming ? "none" : "flex";
    }
    if (els.btnStop) {
      els.btnStop.classList.toggle("hidden", !streaming);
      els.btnStop.style.display = streaming ? "flex" : "none";
    }
    if (els.promptInput) {
      els.promptInput.disabled = streaming;
      if (!streaming) els.promptInput.focus();
    }
  }

  function stopStreaming() {
    if (abortController) {
      abortController.abort();
    }
  }

  return {
    init,
    updateContextFileName,
    sendUserMessage
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.SmartCodeAI.init();
});
