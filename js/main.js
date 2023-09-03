import Task from "./task";

let tasks = []; // array of tasks stored in localStorage

const newTasksContainer = document.querySelector("[data-newtasks");
const input = document.querySelector("[data-input]");
const addbtn = document.querySelector("[data-addbtn]");
const tasksCount = document.querySelector("[data-tasks-count]");
const completeCount = document.querySelector("[data-complete-count]");
const openCount = document.querySelector("[data-open-count]");

// initialize the localStorage
if (!localStorage.hasOwnProperty("tasks"))
  localStorage.setItem("tasks", JSON.stringify([]));
else tasks = JSON.parse(localStorage.tasks);

if (localStorage.getItem("fetch") !== "true")
  localStorage.setItem("fetch", "false");

function handleAdd(event) {
  let value = input.value;
  input.value = "";
  if (!value) {
    alert("Please enter a value");
    return;
  }
  tasks.push(new Task(value));
  saveAndRender();
}

function handleCheck(taskIndex) {
  tasks[taskIndex].completed = true;
  saveAndRender();
}

function handleDelete(taskIndex) {
  if (confirm("Are you sure you want to delete the task?")) {
    tasks.splice(taskIndex, 1);
    saveAndRender();
  }
}

function handleRepeat(taskIndex) {
  tasks[taskIndex].completed = false;
  saveAndRender();
}

addbtn.addEventListener("click", handleAdd);

input.addEventListener("keydown", (event) => {
  // if enter key is pressed
  if (event.keyCode == 13) handleAdd(event);
});

input.addEventListener("input", (event) => {
  if (input.value == " ") render();
  else {
    let userInput = input.value.toLowerCase();

    let filteredTasks = tasks.filter((task) =>
      task.todo.toLowerCase().includes(userInput)
    );

    render(filteredTasks);
  }
});

newTasksContainer.addEventListener("click", (event) => {
  let target = event.target;

  if (target.tagName.toLowerCase() === "i") {
    let taskElement = event.target.closest(".task");
    let taskId = parseInt(taskElement.dataset.taskId);
    let taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (target.classList.contains("fa-check")) handleCheck(taskIndex);
    else if (target.classList.contains("fa-x")) handleDelete(taskIndex);
    else if (target.classList.contains("fa-rotate-left"))
      handleRepeat(taskIndex);
  }
});

function save() {
  localStorage.tasks = JSON.stringify(tasks);
}

function render(list = tasks) {
  clearElement(newTasksContainer);
  list.forEach((task) => {
    let taskElement = createTaskElement(task);
    newTasksContainer.appendChild(taskElement);
  });

  renderTasksCount();
}

function saveAndRender() {
  save();
  render();
}

function renderTasksCount() {
  clearElement(tasksCount);
  clearElement(completeCount);
  clearElement(openCount);

  let completeTasks = tasks.filter((task) => task.completed === true);

  tasksCount.append(document.createTextNode(tasks.length + " Tasks"));
  completeCount.append(
    document.createTextNode(completeTasks.length + " Complete")
  );
  openCount.append(
    document.createTextNode(tasks.length - completeTasks.length + " Open")
  );
}

function clearElement(element) {
  while (element.firstChild) element.removeChild(element.firstChild);
}

function createTaskElement(task) {
  let taskElement = document.createElement("div");
  taskElement.dataset.taskId = task.id;
  taskElement.classList.add("task");
  if (task.completed) taskElement.classList.add("completed");
  let action = task.completed ? "rotate-left" : "check";

  taskElement.innerHTML = `          
      <span contenteditable="true" class="task-content ">${task.todo}</span>
        <div class="actions">
        <i role="button" class="fa-solid fa-x"></i>
        <i role="button" class="fa-solid fa-${action}"></i>
      </div>`;

  return taskElement;
}

// ----------------------------------------------------------------
async function getToDo() {
  if (localStorage.getItem("fetch") == "false") {
    localStorage.setItem("fetch", "true");
    let response = await fetch("https://dummyjson.com/todos");
    let data = await response.json();
    tasks.push(...data.todos);
    saveAndRender();
  }
}

getToDo();
render();
