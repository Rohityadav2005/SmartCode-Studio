/**
 * SmartCode Studio - RPG Overworld & Analytics Dashboard Controller
 * Handles SVG winding path generation, interactive node clicks,
 * radar chart rendering, and contribution heatmap generation.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Campaign World Data
  const WORLD_NODES = [
    {
      id: "node-1",
      number: 1,
      type: "standard",
      title: "Variables Sanctuary",
      desc: "Master Python primitive types, dynamic memory allocation, and f-string formatting expressions.",
      status: "completed",
      stars: 3,
      x: 15, // percentage across map
      y: 88,
      xp: 150,
      rule: "Solve with 0 hints and ≤ 2 runs for 3 stars.",
      lessonLink: "index.html"
    },
    {
      id: "node-2",
      number: 2,
      type: "standard",
      title: "Conditional Crossroads",
      desc: "Implement multi-branch decision trees with Python's indentation rules and boolean short-circuiting.",
      status: "completed",
      stars: 3,
      x: 35,
      y: 78,
      xp: 200,
      rule: "Solve with 0 hints and ≤ 2 runs for 3 stars.",
      lessonLink: "index.html"
    },
    {
      id: "node-3",
      number: 3,
      type: "standard",
      title: "Looping Labyrinth",
      desc: "Navigate while loops, for-in sequences, iteration guards, and break/continue flow controls.",
      status: "completed",
      stars: 2,
      x: 65,
      y: 68,
      xp: 220,
      rule: "Solve with 0 hints and ≤ 2 runs for 3 stars.",
      lessonLink: "index.html"
    },
    {
      id: "node-4",
      number: 4,
      type: "standard",
      title: "List Comprehension Glade",
      desc: "Craft elegant functional list, set, and dictionary comprehensions with inline conditionals.",
      status: "completed",
      stars: 3,
      x: 82,
      y: 52,
      xp: 250,
      rule: "Solve with 0 hints and ≤ 2 runs for 3 stars.",
      lessonLink: "index.html"
    },
    {
      id: "node-5",
      number: 5,
      type: "checkpoint",
      title: "Checkpoint: Scope & Closures",
      desc: "Demonstrate LEGB scope hierarchy (Local, Enclosing, Global, Built-in) under quiz evaluation.",
      status: "completed",
      stars: 3,
      x: 55,
      y: 42,
      xp: 300,
      rule: "Attain 100% accuracy on concept verification.",
      lessonLink: "index.html"
    },
    {
      id: "node-6",
      number: 6,
      type: "standard",
      title: "The Nested Loop Trial",
      desc: "Traverse 2D matrices and grids with O(N^2) complexity optimization and boundary checks.",
      status: "active",
      stars: 0,
      x: 25,
      y: 32,
      xp: 350,
      rule: "Complete without recursion limit errors.",
      lessonLink: "index.html"
    },
    {
      id: "node-7",
      number: 7,
      type: "sidequest",
      title: "Side-Quest: Hash Map Inversion",
      desc: "Optional bonus dungeon: solve the classic frequency counter pattern in O(N) linear time.",
      status: "unlocked",
      stars: 0,
      x: 50,
      y: 20,
      xp: 400,
      rule: "Bonus Side-Quest (+150 Bonus XP).",
      lessonLink: "index.html"
    },
    {
      id: "node-8",
      number: 8,
      type: "boss",
      title: "BOSS BATTLE: Algorithmic Leviathan",
      desc: "Timed Capstone Dungeon: Build an in-memory transactional cache with LRU eviction in 15 minutes!",
      status: "locked",
      stars: 0,
      x: 75,
      y: 8,
      xp: 1000,
      rule: "Timed 15:00 Boss Battle. Passing awards Chapter 1 Champion Trophy!",
      lessonLink: "index.html"
    }
  ];

  initRPGOverworldMap();
  renderSkillRadarChart();
  generateContributionHeatmap();
  setupModalHandlers();

  /**
   * 1. Draw Winding SVG Bezier Paths & Render Interactive Stepping Stones
   */
  function initRPGOverworldMap() {
    const nodesContainer = document.getElementById("map-nodes-layer");
    const svgCanvas = document.getElementById("map-svg-canvas");
    if (!nodesContainer || !svgCanvas) return;

    // Get container dimensions
    const viewport = document.getElementById("overworld-map-viewport");
    const width = viewport.clientWidth || 800;
    const height = viewport.clientHeight || 680;

    // Compute pixel coordinates
    const points = WORLD_NODES.map(node => ({
      x: (node.x / 100) * width,
      y: (node.y / 100) * height,
      node: node
    }));

    // Build smooth cubic bezier curve SVG path
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midY = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }

    svgCanvas.innerHTML = `
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="60%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#ef4444" />
        </linearGradient>
      </defs>
      <path class="map-path-background" d="${d}" />
      <path class="map-path-completed" d="${d}" />
    `;

    // Render node elements
    nodesContainer.innerHTML = "";
    points.forEach(({ x, y, node }) => {
      const elem = document.createElement("div");
      elem.className = `level-node ${node.status} ${node.type === 'boss' ? 'boss-node' : ''}`;
      elem.style.left = `${x}px`;
      elem.style.top = `${y}px`;

      let icon = '<i class="fa-solid fa-code"></i>';
      if (node.status === "completed") icon = '<i class="fa-solid fa-check"></i>';
      else if (node.status === "locked") icon = '<i class="fa-solid fa-lock"></i>';
      else if (node.type === "boss") icon = '<i class="fa-solid fa-skull boss-skull-icon"></i>';
      else if (node.type === "checkpoint") icon = '<i class="fa-solid fa-shield-halved"></i>';
      else if (node.type === "sidequest") icon = '<i class="fa-solid fa-compass"></i>';

      let starsHtml = "";
      if (node.stars > 0) {
        starsHtml = '<div class="node-stars-row">' +
          Array(node.stars).fill('<i class="fa-solid fa-star"></i>').join("") +
        '</div>';
      }

      let haloHtml = node.status === "active" ? '<div class="node-ripple-halo"></div>' : '';

      elem.innerHTML = `
        ${haloHtml}
        <div class="node-inner">
          ${icon}
          ${starsHtml}
        </div>
        <div class="node-label-pill">${node.number}. ${node.title}</div>
      `;

      elem.addEventListener("click", () => {
        openNodeModal(node);
      });

      nodesContainer.appendChild(elem);
    });
  }

  // Handle window resizing
  window.addEventListener("resize", () => {
    initRPGOverworldMap();
  });

  /**
   * 2. Modal Details Drawer
   */
  function openNodeModal(node) {
    const backdrop = document.getElementById("node-modal-backdrop");
    const badge = document.getElementById("modal-badge");
    const title = document.getElementById("modal-title");
    const desc = document.getElementById("modal-desc");
    const xp = document.getElementById("modal-xp-val");
    const actionBtn = document.getElementById("modal-action-btn");
    const statusNote = document.getElementById("modal-status-note");

    badge.textContent = node.type.toUpperCase() + (node.status === 'locked' ? ' • LOCKED' : ' • READY');
    badge.className = `modal-header-badge ${node.type === 'boss' ? 'boss' : 'standard'}`;
    title.textContent = `${node.number}. ${node.title}`;
    desc.textContent = node.desc;
    xp.textContent = `+${node.xp} XP`;
    statusNote.textContent = node.rule;

    if (node.status === "locked") {
      actionBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Prerequisite Level Incomplete';
      actionBtn.style.opacity = "0.5";
      actionBtn.style.pointerEvents = "none";
    } else {
      actionBtn.innerHTML = '<i class="fa-solid fa-play"></i> Enter Arena in IDE';
      actionBtn.style.opacity = "1";
      actionBtn.style.pointerEvents = "auto";
      actionBtn.onclick = () => {
        window.location.href = "index.html";
      };
    }

    backdrop.style.display = "flex";
  }

  function setupModalHandlers() {
    const backdrop = document.getElementById("node-modal-backdrop");
    const closeBtn = document.getElementById("btn-close-modal");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        backdrop.style.display = "none";
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) backdrop.style.display = "none";
      });
    }
  }

  /**
   * 3. Interactive Skill Mastery Radar Chart Component
   * Matches specifications: 5 pentagonal grid levels (#292F38),
   * periwinkle-blue stroke (#8585FF), translucent indigo fill (#6258E8 @ 38%),
   * cyan markers (#00C8E8), and muted gray-blue labels (#8C99AD).
   */
  function renderSkillRadarChart() {
    const canvas = document.getElementById("radarChart");
    const tooltip = document.getElementById("radar-tooltip");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Exact skill categories and proficiency scores (0–100)
    const skills = [
      { name: "Python Core", score: 90 },
      { name: "Data Wrangling", score: 75 },
      { name: "Algorithms", score: 55 },
      { name: "SQL & DBs", score: 80 },
      { name: "Debugging", score: 85 }
    ];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 6;
    const maxRadius = 96; // Proportional for 460x290 canvas
    const total = skills.length;
    let hoveredPointIndex = -1;

    // Computed coordinates of player data points
    function getSkillPoints() {
      return skills.map((item, i) => {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const dist = (item.score / 100) * maxRadius;
        return {
          x: centerX + dist * Math.cos(angle),
          y: centerY + dist * Math.sin(angle),
          angle,
          skill: item.name,
          score: item.score
        };
      });
    }

    function drawChart() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw five concentric pentagonal grid levels (#292F38)
      for (let level = 1; level <= 5; level++) {
        const r = (maxRadius / 5) * level;
        ctx.beginPath();
        for (let i = 0; i < total; i++) {
          const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = "#292F38";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. Draw radial axis lines and external category labels (#8C99AD)
      ctx.font = "500 12.5px 'Plus Jakarta Sans', -apple-system, sans-serif";
      ctx.fillStyle = "#8C99AD";

      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const edgeX = centerX + maxRadius * Math.cos(angle);
        const edgeY = centerY + maxRadius * Math.sin(angle);

        // Radial line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(edgeX, edgeY);
        ctx.strokeStyle = "#292F38";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label alignment based on quadrant
        const labelDist = maxRadius + 24;
        const lx = centerX + labelDist * Math.cos(angle);
        const ly = centerY + labelDist * Math.sin(angle);

        if (Math.abs(Math.cos(angle)) < 0.1) {
          ctx.textAlign = "center";
        } else if (Math.cos(angle) > 0) {
          ctx.textAlign = "left";
        } else {
          ctx.textAlign = "right";
        }
        ctx.textBaseline = "middle";

        ctx.fillText(skills[i].name, lx, ly);
      }

      // 3. Draw player skill polygon: translucent indigo fill (#6258E8 @ 38%)
      const points = getSkillPoints();
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();

      ctx.fillStyle = "rgba(98, 88, 232, 0.38)";
      ctx.fill();

      // Soft periwinkle-blue stroke (#8585FF), 2px wide
      ctx.strokeStyle = "#8585FF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Place small bright cyan circular markers (#00C8E8) at each data point
      points.forEach((p, i) => {
        const isHovered = hoveredPointIndex === i;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHovered ? 6.5 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#00C8E8";
        ctx.fill();
        ctx.strokeStyle = "#151A21";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Subtle glow around point
        ctx.shadowColor = "rgba(0, 200, 232, 0.6)";
        ctx.shadowBlur = isHovered ? 12 : 6;
      });

      // Reset shadow
      ctx.shadowBlur = 0;
    }

    // Initial draw
    drawChart();

    // Interactive mouse move for hover detection and tooltip
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const points = getSkillPoints();
      let foundIndex = -1;

      points.forEach((p, i) => {
        const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (dist <= 15) {
          foundIndex = i;
        }
      });

      if (foundIndex !== hoveredPointIndex) {
        hoveredPointIndex = foundIndex;
        drawChart();
      }

      if (foundIndex !== -1 && tooltip) {
        const p = points[foundIndex];
        tooltip.style.display = "block";
        tooltip.style.left = `${(p.x / canvas.width) * 100}%`;
        tooltip.style.top = `${(p.y / canvas.height) * 100}%`;
        tooltip.innerHTML = `<span>${p.skill}</span>: <strong>${p.score} / 100</strong>`;
      } else if (tooltip) {
        tooltip.style.display = "none";
      }
    });

    canvas.addEventListener("mouseleave", () => {
      hoveredPointIndex = -1;
      drawChart();
      if (tooltip) tooltip.style.display = "none";
    });
  }

  /**
   * 4. 52-Week GitHub Style Daily Contribution Heatmap
   */
  function generateContributionHeatmap() {
    const grid = document.getElementById("heatmap-grid");
    if (!grid) return;

    grid.innerHTML = "";
    const totalDays = 52 * 7;

    for (let i = 0; i < totalDays; i++) {
      const cell = document.createElement("div");
      // Simulate realistic activity curve
      const rand = Math.random();
      let level = "l0";
      if (rand > 0.88) level = "l4";
      else if (rand > 0.72) level = "l3";
      else if (rand > 0.52) level = "l2";
      else if (rand > 0.35) level = "l1";

      cell.className = `heatmap-cell ${level}`;
      cell.title = `Day ${i + 1}: ${level === 'l0' ? '0' : (level === 'l4' ? '12+' : '3-8')} coding exercises executed`;
      grid.appendChild(cell);
    }
  }

  // Micro-drill button trigger
  const drillBtn = document.getElementById("btn-start-drill");
  if (drillBtn) {
    drillBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
