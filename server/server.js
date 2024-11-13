import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { authRouter } from './routes/auth.js';
import { stockRouter } from './routes/stocks.js';
import { watchlistRouter } from './routes/watchlist.js';
import { verifyToken } from './middleware/auth.js';
import { searchRoutes } from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
    // origin: 'https://stock-analysis.yashlunawat.com/',
    // origin: process.env.FRONTEND_URL,
    origin:true,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);
app.use('/api/auth', authRouter);
app.use('/api/search', verifyToken, searchRoutes);
app.use('/api/stocks', verifyToken, stockRouter);
app.use('/api/watchlist', verifyToken, watchlistRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});