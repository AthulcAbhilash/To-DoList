const addBtn = document.getElementById("addBtn");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");

const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const taskContainer = document.getElementById("taskContainer");

const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");

let tasks = [];
let deleted = null;
let editId = null;

addBtn.onclick = () => overlay.classList.remove("hidden");

closeBtn.onclick = () => {
  overlay.classList.add("hidden");
  clearInputs();
  editId = null;
};

saveBtn.onclick = () => {
  if (!titleInput.value.trim()) return alert("Title required");

  if (editId) {
    const t = tasks.find(t => t.id === editId);
    t.title = titleInput.value;
    t.desc = descInput.value;
    t.priority = priorityInput.value;
    t.date = dateInput.value;
    editId = null;
  } else {
    tasks.push({
      id: Date.now(),
      title: titleInput.value,
      desc: descInput.value,
      priority: priorityInput.value,
      date: dateInput.value,
      completed: false
    });
  }

  render();
  overlay.classList.add("hidden");
  clearInputs();
};

function clearInputs() {
  titleInput.value = "";
  descInput.value = "";
  dateInput.value = "";
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  deleted = tasks[index];
  tasks.splice(index, 1);
  render();
}

undoBtn.onclick = () => {
  if (deleted) {
    tasks.push(deleted);
    deleted = null;
    render();
  }
};

clearBtn.onclick = () => {
  tasks = [];
  render();
};

function toggleComplete(id) {
  const t = tasks.find(t => t.id === id);
  t.completed = !t.completed;
  render();
}

function editTask(id) {
  const t = tasks.find(t => t.id === id);

  titleInput.value = t.title;
  descInput.value = t.desc;
  priorityInput.value = t.priority;
  dateInput.value = t.date;

  editId = id;
  overlay.classList.remove("hidden");
}

function getUrgencyClass(date) {
  if (!date) return "";

  const today = new Date();
  today.setHours(0,0,0,0);

  const taskDate = new Date(date);
  taskDate.setHours(0,0,0,0);

  const diff = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return "urgent-overdue";
  if (diff === 1) return "urgent-red";
  if (diff <= 3) return "urgent-yellow";
  if (diff <= 5) return "urgent-green";

  return "urgent-blue";
}

function render() {
  taskContainer.innerHTML = "";

  tasks.forEach(t => {
    const div = document.createElement("div");

    const urgency = getUrgencyClass(t.date);

    div.className = `task-card priority-${t.priority} ${urgency}`;
    if (t.completed) div.classList.add("completed");

    div.innerHTML = `
      <h3>${t.title}</h3>
      <div class="task-preview">${t.desc || ""}</div>
      <div class="task-date">${t.date ? "📅 " + t.date : ""}</div>

      <div class="task-actions">
        <button onclick="toggleComplete(${t.id})">
          ${t.completed ? "Undo" : "Done"}
        </button>
        <button onclick="editTask(${t.id})">Edit</button>
        <button onclick="deleteTask(${t.id})">Delete</button>
      </div>
    `;

    taskContainer.appendChild(div);
  });
}