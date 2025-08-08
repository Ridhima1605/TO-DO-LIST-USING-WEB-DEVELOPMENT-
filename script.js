let taskInput = document.getElementById("task-input");
let taskList = document.getElementById("task-list");
let toast = document.getElementById("toast");
let confetti = document.getElementById("confetti");
let ctx = confetti.getContext("2d");
let particles = [];

if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

window.onload = () => {
  loadTasks();
  resizeCanvas();
};

function addTask() {
  let text = taskInput.value.trim();
  if (!text) return showToast("⚠️ Enter a task!");
  addToDOM(text, false);
  saveTasks();
  taskInput.value = "";
  showToast("✅ Task added!");
}

function addToDOM(text, completed) {
  let li = document.createElement("li");
  if (completed) li.classList.add("completed");
  li.innerHTML = `
    <span onclick="toggleTask(this)" ondblclick="editTask(this)">${text}</span>
    <button onclick="deleteTask(this)">❌</button>
  `;
  taskList.appendChild(li);
}

function toggleTask(el) {
  el.parentElement.classList.toggle("completed");
  saveTasks();
  launchConfetti();
}

function editTask(el) {
  let newText = prompt("Edit task:", el.textContent);
  if (newText) {
    el.textContent = newText;
    saveTasks();
    showToast("✏️ Task updated");
  }
}

function deleteTask(btn) {
  btn.parentElement.remove();
  saveTasks();
  showToast("🗑️ Task deleted");
}

function clearAll() {
  taskList.innerHTML = "";
  saveTasks();
  showToast("🧹 All tasks cleared");
}

function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("todo_fun_tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("todo_fun_tasks")) || [];
  tasks.forEach(t => addToDOM(t.text, t.completed));
}

function filterTasks(type) {
  document.querySelectorAll("#task-list li").forEach(li => {
    switch (type) {
      case "all":
        li.style.display = "flex"; break;
      case "active":
        li.style.display = li.classList.contains("completed") ? "none" : "flex"; break;
      case "completed":
        li.style.display = li.classList.contains("completed") ? "flex" : "none"; break;
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2000);
}

function resizeCanvas() {
  confetti.width = window.innerWidth;
  confetti.height = window.innerHeight;
}

window.onresize = resizeCanvas;

function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * confetti.width,
      y: confetti.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 4 + 2,
      angle: Math.random() * 2 * Math.PI,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confetti.width, confetti.height);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.y -= p.speed;
    if (p.y < -10) particles.splice(i, 1);
  }
  requestAnimationFrame(drawConfetti);
}
drawConfetti();
