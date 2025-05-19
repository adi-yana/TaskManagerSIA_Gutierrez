let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'All';

// Function to add a task
function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  const dueDate = document.getElementById('dueDateInput').value;
  const priority = document.getElementById('priorityInput').value;
  const category = document.getElementById('categoryInput').value;
  const description = document.getElementById('descriptionInput').value.trim();  // NEW

  if (!text || !dueDate) return;

  const task = {
    id: Date.now(),
    text,
    dueDate,
    priority,
    category,
    description, // NEW
    completed: false
  };

  tasks.push(task);
  saveTasks();
  resetForm();
  renderTasks();
}

// Function to mark a task as complete/incomplete
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// Function to delete a task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Function to edit a task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt("Edit task:", task.text);
  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
  }

  const newDescription = prompt("Edit description:", task.description || "");
  if (newDescription !== null) {
    task.description = newDescription.trim();
  }

  saveTasks();
  renderTasks();
}

// Function to filter tasks based on their status (All, Completed, Pending)
function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filters .filter').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(filter)) {
      btn.classList.add('active');
    }
  });
  renderTasks();
}

// Function to render all tasks based on the filter
function renderTasks() {
  const taskList = document.getElementById('taskList');
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filteredTasks = tasks.filter(task => {
    const isCompleted = currentFilter === 'Completed' ? task.completed : currentFilter === 'Pending' ? !task.completed : true;
    const isTextMatching = task.text.toLowerCase().includes(searchInput) || (task.description && task.description.toLowerCase().includes(searchInput)); // include description in search
    return isCompleted && isTextMatching;
  });

  taskList.innerHTML = '';
  filteredTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task');
    if (task.completed) taskItem.classList.add('completed');
    if (new Date(task.dueDate) < new Date() && !task.completed) taskItem.classList.add('overdue');

    taskItem.innerHTML = 
      `<div class="task-info">
        <span class="task-text">${task.text}</span>
        ${task.description ? `<small>Description: ${task.description}</small>` : ''}
        <small>Due: ${task.dueDate} | ${task.category} | Priority: <span class="task-priority ${task.priority}">${task.priority}</span></small>
      </div>
      <div class="button-group">
        <button class="complete-btn" onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>`;

    taskList.appendChild(taskItem);
  });

  updateTaskCounts();
}

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to reset the task input form
function resetForm() {
  document.getElementById('taskInput').value = '';
  document.getElementById('dueDateInput').value = '';
  document.getElementById('priorityInput').value = 'Medium';
  document.getElementById('categoryInput').value = 'Work';
  document.getElementById('descriptionInput').value = '';  // NEW
}

// Function to clear all completed tasks
function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

// Function to toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// Function to sort tasks by due date
function sortTasks() {
  const sortValue = document.getElementById('sortInput').value;
  if (sortValue === "dueDateAsc") {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortValue === "dueDateDesc") {
    tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }
  saveTasks();
  renderTasks();
}

// Function to update task counts
function updateTaskCounts() {
  const totalTaskCount = tasks.length;
  const completedTaskCount = tasks.filter(task => task.completed).length;
  const pendingTaskCount = totalTaskCount - completedTaskCount;

  document.getElementById('totalTaskCount').textContent = totalTaskCount;
  document.getElementById('completedTaskCount').textContent = completedTaskCount;
  document.getElementById('pendingTaskCount').textContent = pendingTaskCount;
}

// Initialize the app by rendering the tasks
document.addEventListener('DOMContentLoaded', renderTasks);
