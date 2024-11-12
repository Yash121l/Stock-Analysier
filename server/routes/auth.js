import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validateRegistration, validateLogin } from '../validators/auth.js';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

export const authRouter = router;