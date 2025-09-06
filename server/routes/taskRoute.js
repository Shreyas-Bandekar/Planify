import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, getTaskById, bulkCreateTasks, getTaskStats } from '../controllers/taskController.js';
import authMiddleware from '../middlewares/auth.js';

const taskRouter = express.Router();

taskRouter.route('/gp').get(authMiddleware,getTasks).post(authMiddleware,createTask);
taskRouter.route('/gp/:id').get(authMiddleware,getTaskById).put(authMiddleware,updateTask).delete(authMiddleware,deleteTask);
taskRouter.route('/bulk').post(authMiddleware, bulkCreateTasks);
taskRouter.route('/stats').get(authMiddleware, getTaskStats);

export default taskRouter;