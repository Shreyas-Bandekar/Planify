import express from 'express';
import {registerUser,loginUser,getCurrentUser,updateProfile,changePassword } from '../controllers/userController.js';

const userRouter = express.Router();

// Public Route
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Private Route protect middleware also
userRouter.get('/me', getCurrentUser);
userRouter.put('/profile', updateProfile);
userRouter.put('/password', changePassword);