import Task from '../models/taskModel.js';

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