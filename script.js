// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAllBtn');

// Load tasks from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});
clearAllBtn.addEventListener('click', clearAllTasks);

// Function: Add New Task
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    alert('Please enter a task!');
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  saveTaskToStorage(task);
  renderTask(task);
  taskInput.value = '';
  updateCount();
}

// Function: Render Single Task UI
function renderTask(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task.id);
  if (task.completed) li.classList.add('completed');

  li.innerHTML = `
    <span onclick="toggleTask(${task.id})">${task.text}</span>
    <i class="fa-solid fa-trash delete-btn" onclick="deleteTask(${task.id})"></i>
  `;

  taskList.appendChild(li);
}

// Function: Toggle Complete Status
function toggleTask(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  refreshUI();
}

// Function: Delete Single Task
function deleteTask(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  refreshUI();
}

// Function: Clear All Tasks
function clearAllTasks() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    localStorage.removeItem('tasks');
    refreshUI();
  }
}

// Helpers for localStorage
function getTasksFromStorage() {
  return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function saveTaskToStorage(task) {
  const tasks = getTasksFromStorage();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasksFromStorage();
  tasks.forEach(task => renderTask(task));
  updateCount();
}

function refreshUI() {
  taskList.innerHTML = '';
  loadTasks();
}

function updateCount() {
  const tasks = getTasksFromStorage();
  const pendingTasks = tasks.filter(task => !task.completed);
  taskCount.textContent = `${pendingTasks.length} task${pendingTasks.length !== 1 ? 's' : ''} left`;
} 
