import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validateRegistration, validateLogin } from '../validators/auth.js';

// Register user
export const registerUser = async (req, res) => {
    try {
        const validation = validateRegistration(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues[0].message });
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const validation = validateLogin(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues[0].message });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

//logout User
export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
}