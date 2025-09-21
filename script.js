$(document).ready(function() {
    // Task array to store all tasks
    let tasks = [];
    let taskIdCounter = 1;
    let currentFilter = 'all';

    // Add task functionality
    $('#addTaskBtn').click(function() {
        addTask();
    });

    // Allow Enter key to add task
    $('#taskInput').keypress(function(e) {
        if (e.which === 13) {
            addTask();
        }
    });

    // Filter functionality
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        renderTasks();
    });

    // Add task function
    function addTask() {
        const taskText = $('#taskInput').val().trim();

        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        const task = {
            id: taskIdCounter++,
            text: taskText,
            completed: false,
            createdAt: new Date()
        };

        tasks.push(task);
        $('#taskInput').val('');
        renderTasks();
        updateStatistics();

        // Show success message
        showNotification('Task added successfully!', 'success');
    }

    // Render tasks based on current filter
    function renderTasks() {
        const $taskList = $('#taskList');
        $taskList.empty();

        let filteredTasks = tasks;

        // Apply filter
        switch (currentFilter) {
            case 'active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }

        if (filteredTasks.length === 0) {
            $taskList.append(`
                <div class="text-center py-4 text-muted">
                    <h5>No tasks found</h5>
                    <p>
                        ${currentFilter === 'all' ? 'Add your first task above!' : 
                          currentFilter === 'active' ? 'No active tasks. Great job!' : 
                          'No completed tasks yet.'}
                    </p>
                </div>
            `);
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            $taskList.append(taskElement);
        });
    }

    // Create task element
    function createTaskElement(task) {
        return `
            <div class="list-group-item task-item ${task.completed ? 'completed' : ''} fade-in" data-task-id="${task.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center flex-grow-1">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                               onchange="toggleTask(${task.id})">
                        <p class="task-text mb-0">${escapeHtml(task.text)}</p>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-edit btn-sm" onclick="editTask(${task.id})">
                            Edit
                        </button>
                        <button class="btn btn-delete btn-sm" onclick="deleteTask(${task.id})">
                            Delete
                        </button>
                    </div>
                </div>
                <small class="text-muted">Created: ${formatDate(task.createdAt)}</small>
            </div>
        `;
    }

    // Toggle task completion status
    window.toggleTask = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
            updateStatistics();

            const status = task.completed ? 'completed' : 'marked as active';
            showNotification(`Task ${status}!`, 'info');
        }
    };

    // Edit task function
    window.editTask = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                renderTasks();
                showNotification('Task updated successfully!', 'success');
            }
        }
    };

    // Delete task function
    window.deleteTask = function(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            const taskElement = $(`[data-task-id="${taskId}"]`);
            taskElement.addClass('slide-out');

            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== taskId);
                renderTasks();
                updateStatistics();
                showNotification('Task deleted successfully!', 'warning');
            }, 300);
        }
    };

    // Update statistics
    function updateStatistics() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const active = total - completed;

        $('#totalTasks').text(total);
        $('#activeTasks').text(active);
        $('#completedTasks').text(completed);
    }

    // Show notification
    function showNotification(message, type) {
        // Remove existing notifications
        $('.notification').remove();

        const notification = $(`
            <div class="notification alert alert-${type} alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 1050; min-width: 300px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        $('body').append(notification);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.alert('close');
        }, 3000);
    }

    // Utility function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Format date
    function formatDate(date) {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Initialize the application
    function init() {
        // Load sample tasks for demonstration
        const sampleTasks = [
            { id: taskIdCounter++, text: 'Welcome to your To-Do List!', completed: false, createdAt: new Date() },
            { id: taskIdCounter++, text: 'Click the checkbox to mark tasks as completed', completed: false, createdAt: new Date() },
            { id: taskIdCounter++, text: 'Use the filter buttons to view different task categories', completed: true, createdAt: new Date() }
        ];

        tasks = sampleTasks;
        renderTasks();
        updateStatistics();

        console.log('To-Do List Application initialized successfully!');
    }

    // Initialize the application
    init();

    // Keyboard shortcuts
    $(document).keydown(function(e) {
        // Ctrl/Cmd + Enter to add task
        if ((e.ctrlKey || e.metaKey) && e.which === 13) {
            addTask();
        }

        // Escape to clear input
        if (e.which === 27) {
            $('#taskInput').val('').focus();
        }
    });

    // Focus on input when page loads
    $('#taskInput').focus();
});