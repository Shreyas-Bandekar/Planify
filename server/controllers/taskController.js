import Task from '../models/taskModel.js';

// Create a task
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;
        const newTask = new Task({
            title,
            description,
            priority,
            dueDate,
            completed: completed === "yes" || completed === true,
            owner: req.user.id
        });
        const saved = await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
}

// Get all tasks for loggedin user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
}

// Get single task by id (belong to loggedin user)
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error fetching task", error });
    }
}

// Update a task
export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.completed !== undefined) {
            data.completed = data.completed === "yes" || data.completed === true;
        }

        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
}

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!deleted) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
}

// Bulk create tasks (for import functionality)
export const bulkCreateTasks = async (req, res) => {
    try {
        const { tasks } = req.body;
        if (!Array.isArray(tasks) || tasks.length === 0) {
            return res.status(400).json({ message: "Tasks array is required" });
        }

        const tasksWithOwner = tasks.map(task => ({
            ...task,
            owner: req.user.id
        }));

        const createdTasks = await Task.insertMany(tasksWithOwner);
        res.status(201).json({
            message: `Successfully created ${createdTasks.length} tasks`,
            tasks: createdTasks
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating tasks", error });
    }
}

// Get task statistics
export const getTaskStats = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id });
        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
            overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && !t.completed).length,
            byPriority: {
                high: tasks.filter(t => t.priority === 'high').length,
                medium: tasks.filter(t => t.priority === 'medium').length,
                low: tasks.filter(t => t.priority === 'low').length
            }
        };
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching statistics", error });
    }
}