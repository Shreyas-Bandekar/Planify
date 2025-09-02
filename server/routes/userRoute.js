import express from 'express';
import {registerUser,loginUser,getCurrentUser,updateProfile,changePassword } from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js';

const userRouter = express.Router();

// Public Route
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Private Route protect middleware also
userRouter.get('/me',authMiddleware, getCurrentUser);
userRouter.put('/profile',authMiddleware, updateProfile);
userRouter.put('/password',authMiddleware, changePassword);

export default userRouter;