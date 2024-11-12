import yahooFinance from 'yahoo-finance2';
import { User } from '../models/User.js';

export const watchlist = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const watchlistData = await Promise.all(
            user.watchlist.map(async (symbol) => {
                try {
                    const quote = await yahooFinance.quote(symbol);
                    return {
                        symbol,
                        price: quote.regularMarketPrice,
                        change: quote.regularMarketChange,
                        changePercent: quote.regularMarketChangePercent
                    };
                } catch (error) {
                    return { symbol, error: 'Failed to fetch data' };
                }
            })
        );

        res.json(watchlistData);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const addToWatchlist = async (req, res) => {
    try {
        const { symbol } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.watchlist.includes(symbol)) {
            user.watchlist.push(symbol);
            await user.save();
        }

        res.json({ message: 'Added to watchlist' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const removeFromWatchlist = async (req, res) => {
    try {
        const { symbol } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.watchlist = user.watchlist.filter(s => s !== symbol);
        await user.save();

        res.json({ message: 'Removed from watchlist' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}