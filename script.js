// Grab elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// Our data source
let tasks = [];
let currentFilter = "all";
loadTasks();

// Event listener
addTaskBtn.addEventListener("click", addTask);
clearCompletedBtn.addEventListener("click", clearCompleted);

function setFilter(filter) {
    currentFilter = filter;

    allBtn.classList.remove("active");
    completedBtn.classList.remove("active");
    pendingBtn.classList.remove("active");

    if (filter === "all") allBtn.classList.add("active");
    if (filter === "completed") completedBtn.classList.add("active");
    if (filter === "pending") pendingBtn.classList.add("active");

    renderTasks();
}

allBtn.addEventListener("click", () => setFilter("all"));
completedBtn.addEventListener("click", () => setFilter("completed"));
pendingBtn.addEventListener("click", () => setFilter("pending"));

// Add task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    taskInput.value = "";

    renderTasks();
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach((task) => {

        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("click", () => {
            toggleTask(task.id);
        });

        const editBtn = document.createElement("button");
editBtn.textContent = "Edit";

editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    editTask(task.id);
});

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "X";

deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTask(task.id);
});

li.appendChild(editBtn);
li.appendChild(deleteBtn);
taskList.appendChild(li);

       
});
    
    //add task counter
    const remaining = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;

}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Edit task
function editTask(id) {
    const task = tasks.find(task => task.id === id);

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) return;

    if (newText.trim() === "") return;

    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, text: newText.trim() }
            : task
    );

    saveTasks();
    renderTasks();
}
