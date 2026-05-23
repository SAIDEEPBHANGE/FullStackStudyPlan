"use strict";

let allPhases = [];
let filteredPhases = [];
let completedPhases = {};
let taskProgress = {};
let currentView = "overview";

// ----- Storage Helpers -----
function initializeProgress() {
  const stored = localStorage.getItem("roadmapProgress");

  if (stored) {
    const parsed = JSON.parse(stored);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed.phases || parsed.tasks)
    ) {
      completedPhases = parsed.phases || {};
      taskProgress = parsed.tasks || {};
    } else {
      completedPhases = parsed;
    }
  }

  allPhases.forEach((p, i) => {
    if (p.checked) {
      completedPhases[`phase-${i}`] = true;
    }

    p.tasks.forEach((t, taskIdx) => {
      const taskKey = `phase-${i}-task-${taskIdx}`;
      if (typeof taskProgress[taskKey] === "undefined" && t.checked) {
        taskProgress[taskKey] = true;
      }
    });
  });

  updateCompletedCount();
}

function saveProgress() {
  localStorage.setItem(
    "roadmapProgress",
    JSON.stringify({ phases: completedPhases, tasks: taskProgress }),
  );
  updateCompletedCount();
}

function updateCompletedCount() {
  const count = Object.values(completedPhases).filter((v) => v).length;
  document.getElementById("completedPhases").textContent = count;
}

// ----- View Management -----
function switchView(view, event) {
  currentView = view;

  document.querySelectorAll(".view-content").forEach((el) => {
    el.classList.add("hidden");
  });

  document.getElementById(view + "-view").classList.remove("hidden");

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.remove("bg-gradient-to-r", "from-blue-500", "to-purple-500");
    btn.classList.add("hover:bg-gray-700");
  });

  if (event && event.target) {
    event.target.classList.add(
      "bg-gradient-to-r",
      "from-blue-500",
      "to-purple-500",
    );
    event.target.classList.remove("hover:bg-gray-700");
  }

  if (view === "timeline") renderTimeline();
  else if (view === "progress") renderProgress();
}

// ----- Data Loading -----
async function loadPhases() {
  try {
    const response = await fetch("phases.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allPhases = await response.json();
    filteredPhases = [...allPhases];
    initializeProgress();
    renderPhases(filteredPhases);
    renderTimeline();
  } catch (error) {
    console.error("Error loading phases:", error);
    document.getElementById("phases").innerHTML =
      '<div class="text-red-400">Error loading phases data</div>';
  }
}

// ----- Rendering -----
function renderPhases(phases) {
  const container = document.getElementById("phases");
  container.innerHTML = "";

  phases.forEach((p, i) => {
    const phaseId = `phase-${i}`;
    const allTasksChecked = p.tasks.every(
      (t, taskIdx) => taskProgress[`phase-${i}-task-${taskIdx}`] || t.checked,
    );
    const isCompleted =
      completedPhases[phaseId] || p.checked || allTasksChecked;

    const difficultyColors = {
      Easy: "bg-green-500 text-green-900",
      Medium: "bg-yellow-500 text-yellow-900",
      Hard: "bg-red-500 text-red-900",
    };

    const difficultyBg = difficultyColors[p.difficulty] || "bg-gray-500";

    const el = document.createElement("div");
    el.className =
      "border border-gray-700 rounded-lg overflow-hidden bg-gray-800 hover:border-gray-600 transition-all " +
      (isCompleted ? "phase-completed" : "");
    el.innerHTML = `
      <div class="flex items-center gap-3 p-4 cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors" onclick="togglePhase(${i}, event)">
        <input type="checkbox" id="check-${i}" class="w-5 h-5 rounded cursor-pointer" ${isCompleted ? "checked" : ""} onclick="togglePhaseCheckbox(${i}, event)">
        <div class="w-3 h-3 rounded-full shrink-0 ${p.dot}"></div>
        <div class="flex-1">
          <div class="font-semibold text-white">${p.title}</div>
          <div class="text-xs text-gray-400 mt-0.5">${p.weeks}</div>
        </div>
        <span class="px-2 py-1 rounded text-xs font-medium ${difficultyBg}">${p.difficulty}</span>
        <span class="text-gray-400 transition-transform duration-200" id="arrow-${i}">▼</span>
      </div>
      <div class="hidden p-4 border-t border-gray-700 bg-gray-800" id="body-${i}">
        ${p.warning ? `<div class="text-xs text-yellow-400 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded px-3 py-2 mb-3">⚠️ ${p.warning}</div>` : ""}
        <div class="space-y-2">
          ${p.tasks
            .map((t, taskIdx) => {
              const taskKey = `phase-${i}-task-${taskIdx}`;
              const taskChecked = taskProgress[taskKey] || t.checked;
              return `
              <div class="flex gap-3 items-start text-sm text-gray-300">
                <input type="checkbox" class="mt-1 cursor-pointer w-4 h-4 rounded" ${taskChecked ? "checked" : ""} onclick="toggleTaskCheckbox(${i}, ${taskIdx}, event)">
                <div>${t.text}</div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  const difficultyColors = {
    Easy: "bg-green-500 text-green-900",
    Medium: "bg-yellow-500 text-yellow-900",
    Hard: "bg-red-500 text-red-900",
  };

  timeline.innerHTML = "";
  allPhases.forEach((p, i) => {
    const difficultyBg = difficultyColors[p.difficulty] || "bg-gray-500";
    const el = document.createElement("div");
    el.className = "flex gap-6 pb-8";
    el.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="w-4 h-4 rounded-full ${p.dot} ring-4 ring-gray-800"></div>
        ${i < allPhases.length - 1 ? '<div class="w-1 h-24 bg-gradient-to-b from-gray-700 to-gray-800 mt-4"></div>' : ""}
      </div>
      <div class="pt-1 pb-8 flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-semibold text-lg">${p.title}</h3>
          <span class="px-2 py-1 rounded text-xs font-medium ${difficultyBg}">${p.difficulty}</span>
        </div>
        <p class="text-sm text-gray-400 mt-1">${p.weeks}</p>
        <div class="mt-3 text-sm text-gray-300 space-y-1">
          ${p.tasks
            .slice(0, 3)
            .map(
              (t) =>
                `<div>• ${t.text.substring(0, 60)}${t.text.length > 60 ? "..." : ""}</div>`,
            )
            .join("")}
        </div>
      </div>
    `;
    timeline.appendChild(el);
  });
}

function renderProgress() {
  const container = document.getElementById("progressContent");
  const completed = Object.values(completedPhases).filter((v) => v).length;
  const total = allPhases.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const difficultyColors = {
    Easy: "bg-green-500 text-green-900",
    Medium: "bg-yellow-500 text-yellow-900",
    Hard: "bg-red-500 text-red-900",
  };

  container.innerHTML = `
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
      <h3 class="text-lg font-semibold mb-4">📊 Overall Progress</h3>
      <div class="flex items-end gap-4">
        <div class="flex-1">
          <div class="h-8 rounded-lg overflow-hidden bg-gray-700">
            <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" style="width: ${percentage}%"></div>
          </div>
        </div>
        <div class="text-3xl font-bold">${percentage}%</div>
      </div>
      <p class="text-sm text-gray-400 mt-4">${completed} of ${total} phases completed</p>
    </div>

    <div class="space-y-3">
      ${allPhases
        .map((p, i) => {
          const phaseId = `phase-${i}`;
          const isCompleted = completedPhases[phaseId] || p.checked;
          const difficultyBg = difficultyColors[p.difficulty] || "bg-gray-500";
          return `
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1">
                <div class="w-3 h-3 rounded-full ${p.dot}"></div>
                <div>
                  <div class="font-semibold">${p.title}</div>
                  <div class="text-xs text-gray-400">${p.weeks}</div>
                </div>
              </div>
              <span class="px-2 py-1 rounded text-xs font-medium ${difficultyBg} mr-3">${p.difficulty}</span>
              <div class="text-2xl cursor-pointer" onclick="togglePhaseCheckbox(${i}, {target: {checked: ${!isCompleted}}})">
                ${isCompleted ? "✅" : "⭕"}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

// ----- Event Handlers -----
function togglePhase(i, event) {
  if (event.target.type === "checkbox") return;

  const body = document.getElementById("body-" + i);
  const arrow = document.getElementById("arrow-" + i);
  const isOpen = !body.classList.contains("hidden");

  if (isOpen) {
    body.classList.add("hidden");
    arrow.textContent = "▶";
  } else {
    body.classList.remove("hidden");
    arrow.textContent = "▼";
  }
}

function togglePhaseCheckbox(i, event) {
  const phaseId = `phase-${i}`;
  completedPhases[phaseId] = event.target.checked;
  saveProgress();
}

function toggleTaskCheckbox(phaseIndex, taskIndex, event) {
  const taskKey = `phase-${phaseIndex}-task-${taskIndex}`;
  taskProgress[taskKey] = event.target.checked;

  const phaseTasks = allPhases[phaseIndex].tasks;
  const allTasksChecked = phaseTasks.every(
    (_, idx) =>
      taskProgress[`phase-${phaseIndex}-task-${idx}`] ||
      phaseTasks[idx].checked,
  );
  const phaseId = `phase-${phaseIndex}`;

  if (allTasksChecked) {
    completedPhases[phaseId] = true;
  } else {
    delete completedPhases[phaseId];
  }

  saveProgress();
}

function filterPhases() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  filteredPhases = allPhases.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.weeks.toLowerCase().includes(query) ||
      p.tasks.some((t) => t.text.toLowerCase().includes(query)),
  );
  renderPhases(filteredPhases);
}

function sortPhases() {
  const sortType = document.getElementById("sortSelect").value;
  let sorted = [...filteredPhases];

  if (sortType === "weeks") {
    sorted.sort((a, b) => {
      const aNum = parseInt(a.weeks.match(/\d+/)[0], 10);
      const bNum = parseInt(b.weeks.match(/\d+/)[0], 10);
      return aNum - bNum;
    });
  } else if (sortType === "difficulty") {
    const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
    sorted.sort((a, b) => {
      const aLevel = difficultyOrder[a.difficulty] || 0;
      const bLevel = difficultyOrder[b.difficulty] || 0;
      return bLevel - aLevel;
    });
  }

  filteredPhases = sorted;
  renderPhases(filteredPhases);
}

function exportData() {
  const data = {
    phases: allPhases,
    progress: completedPhases,
    exportDate: new Date().toLocaleString(),
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `roadmap-progress-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function toggleDarkMode() {
  const root = document.getElementById("appRoot");
  const isLight = root.classList.contains("theme-light");

  if (isLight) {
    root.classList.remove("theme-light");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.add("theme-light");
    localStorage.setItem("theme", "light");
  }
}

// ----- Initialization -----
(function initializeApp() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const root = document.getElementById("appRoot");

  if (savedTheme === "light") {
    root.classList.add("theme-light");
  }

  loadPhases();
})();
