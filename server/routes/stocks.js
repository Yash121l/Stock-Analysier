import express from 'express';
import { stockHistoryData, stockQuoteData } from '../controllers/stocks.js';

const router = express.Router();

router.get('/quote/:symbol', stockQuoteData);

router.get('/history/:symbol', stockHistoryData);

export const stockRouter = router;