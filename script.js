document.addEventListener("DOMContentLoaded", () => {
  
  let intervalID = null;

  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");
  const noteInput = document.getElementById("note-input");
  const saveNoteButton = document.getElementById("save-note-btn");
  const noteList = document.getElementById("note-list");
  const logList = document.getElementById("log-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let sessionLogs = JSON.parse(localStorage.getItem("studyLogs")) || [];
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  let startTime = null;
  let totalElapsed = 0;

function updateDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  document.getElementById(
    "heading"
  ).innerHTML = `<b>${hrs}:${mins}:${secs}</b>`;
}

document.getElementById("start-btn").addEventListener("click", () => {
  if (intervalID) return;
  startTime = Date.now();
  intervalID = setInterval(() => {
    const now = Date.now();
    const elapsed = now - startTime + totalElapsed;
    updateDisplay(elapsed);
  }, 1000);
});

document.getElementById("pause-btn").addEventListener("click", () => {
  if (!intervalID) return;
  clearInterval(intervalID);
  intervalID = null;
  totalElapsed += Date.now() - startTime;
});

document.getElementById("stop-btn").addEventListener("click", () => {
  if (!intervalID && totalElapsed === 0) return;

  clearInterval(intervalID);
  intervalID = null;

  const finalElapsed = Date.now() - startTime + totalElapsed;
  const totalSeconds = Math.floor(finalElapsed / 1000);

  const hrs = String(Math.floor(finalElapsed / 3600000)).padStart(2, "0");
  const mins = String(Math.floor((finalElapsed % 3600000) / 60000)).padStart(
    2,
    "0"
  );
  const secs = String(Math.floor((finalElapsed % 60000) / 1000)).padStart(
    2,
    "0"
  );

  const timeStr = `${hrs}:${mins}:${secs}`;
  const dateStr = new Date().toLocaleString();

  const log = {
    date: dateStr,
    duration: timeStr,
  };

  sessionLogs.push(log);
  saveLogs();
  renderLogs();

  
  startTime = null;
  totalElapsed = 0;
  updateDisplay(0);
  showRandomQuote();

  
  
});


  addTaskButton.addEventListener("click", () => {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    todoInput.value = "";
  });

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function saveLogs() {
    localStorage.setItem("studyLogs", JSON.stringify(sessionLogs));
  }

  function renderLogs() {
    logList.innerHTML = "";
    sessionLogs.forEach((log, index) => {
      const li = document.createElement("li");

      const textSpan = document.createElement("span");
      textSpan.textContent = `${log.date} - ${log.duration}`;

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.style.marginLeft = "10px";
      delBtn.style.background = "red";
      delBtn.style.color = "white";
      delBtn.style.border = "solid white";
      delBtn.style.cursor = "pointer";

      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sessionLogs = sessionLogs.filter((_, i) => i !== index);
        saveLogs();
        renderLogs();
      });

      li.appendChild(textSpan);
      li.appendChild(delBtn);
      logList.appendChild(li);
    });
  }

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `<span>${task.text}</span><button>delete</button>`;

    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });

    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTasks();
      
    });

    todoList.appendChild(li);
  }

  saveNoteButton.addEventListener("click", () => {
    const noteText = noteInput.value.trim();
    if (noteText === "") return;

    notes.push(noteText);
    saveNotes();
    renderNotes();
    noteInput.value = "";
  });

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function renderNotes() {
    noteList.innerHTML = "";

    notes.forEach((noteText, index) => {
      const li = document.createElement("li");
      li.textContent = noteText;

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.style.marginLeft = "10px";
      del.style.background = "red";
      del.style.color = "white";
      del.style.border = "solid white";
      del.style.cursor = "pointer";

      del.addEventListener("click", (e) => {
        e.stopPropagation();
        notes = notes.filter((_, i) => i !== index);
        saveNotes();
        renderNotes();
      });

      li.appendChild(del);
      noteList.appendChild(li);
    });
  }

  // Initial render on load
  tasks.forEach(renderTask);
  renderLogs();
  renderNotes();
});

const quotes = [
  "Keep going, you're doing great!",
  "One day or day one. You decide.",
  "Focus on the goal, not the struggle.",
  "Small progress is still progress.",
  "Stay positive, work hard, make it happen.",
];

function showRandomQuote() {
  const quoteBox = document.getElementById("quote-box");
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  quoteBox.textContent = `"${quote}"`;
  quoteBox.style.opacity = "1";

  setTimeout(() => {
    quoteBox.style.opacity = "0";
  }, 4000); // fade out

  setTimeout(() => {
    quoteBox.textContent = "";
  }, 5000); 
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) {
    document.body.classList.add("dimmed");
  }

}




