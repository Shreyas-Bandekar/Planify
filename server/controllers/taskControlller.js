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
        const data = {...req.body};
        if(data.completed !== undefined){
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