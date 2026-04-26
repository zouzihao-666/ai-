document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskLabel = document.getElementById('taskLabel');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const taskCounter = document.getElementById('taskCounter');
    const darkModeBtn = document.getElementById('darkModeBtn');

    let tasks = loadTasks();
    let isDarkMode = loadDarkMode();

    // 应用暗黑模式
    if (isDarkMode) {
        document.body.classList.add('dark');
        darkModeBtn.textContent = '☀️';
    }

    // 渲染任务
    renderTasks();

    // 添加任务
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // 暗黑模式切换
    darkModeBtn.addEventListener('click', toggleDarkMode);

    function addTask() {
        const taskText = taskInput.value.trim();
        const label = taskLabel.value;
        if (taskText === '') return;

        const task = { text: taskText, completed: false, label: label, priority: false };
        tasks.push(task);
        saveTasks();
        renderTasks();

        taskInput.value = '';
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) li.classList.add('completed');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleComplete(index));

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;

            const labelSpan = document.createElement('span');
            labelSpan.className = `task-label ${task.label}`;
            labelSpan.textContent = task.label;

            const priorityBtn = document.createElement('button');
            priorityBtn.className = 'priority-btn';
            priorityBtn.textContent = '⭐';
            if (task.priority) priorityBtn.classList.add('active');
            priorityBtn.addEventListener('click', () => togglePriority(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', () => deleteTask(index));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(labelSpan);
            li.appendChild(priorityBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
        updateCounter();
        updateEmptyState();
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function togglePriority(index) {
        tasks[index].priority = !tasks[index].priority;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark');
        darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
        saveDarkMode();
    }

    function updateCounter() {
        const pending = tasks.filter(task => !task.completed).length;
        taskCounter.textContent = `还有 ${pending} 个待完成任务`;
    }

    function updateEmptyState() {
        if (tasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const stored = localStorage.getItem('tasks');
        return stored ? JSON.parse(stored) : [];
    }

    function saveDarkMode() {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }

    function loadDarkMode() {
        const stored = localStorage.getItem('darkMode');
        return stored ? JSON.parse(stored) : false;
    }
});