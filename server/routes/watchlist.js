import express from 'express';
import { addToWatchlist, removeFromWatchlist, watchlist } from '../controllers/watchlist.js';

const router = express.Router();

router.get('/', watchlist);

router.post('/:symbol', addToWatchlist);

router.delete('/:symbol', removeFromWatchlist);

export const watchlistRouter = router; 