import { Hono } from 'hono';
import { Env } from '../types';
import { verifyToken } from '../middleware/auth';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../lib/db';
import { getQuoteForWatchlist } from '../lib/yahoo-finance';

const watchlist = new Hono<{ Bindings: Env; Variables: { userId: number } }>();

// Apply auth middleware
watchlist.use('*', verifyToken);

// Get watchlist with current prices
watchlist.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const symbols = await getWatchlist(c.env.DB, userId);
    
    // Fetch current prices for all symbols
    const watchlistData = await Promise.all(
      symbols.map(symbol => getQuoteForWatchlist(symbol))
    );
    
    return c.json(watchlistData);
  } catch (error) {
    console.error('Watchlist error:', error);
    return c.json({ error: 'Server error' }, 500);
  }
});

// Add to watchlist
watchlist.post('/:symbol', async (c) => {
  try {
    const userId = c.get('userId');
    const symbol = c.req.param('symbol');
    
    await addToWatchlist(c.env.DB, userId, symbol);
    return c.json({ message: 'Added to watchlist' });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    return c.json({ error: 'Server error' }, 500);
  }
});

// Remove from watchlist
watchlist.delete('/:symbol', async (c) => {
  try {
    const userId = c.get('userId');
    const symbol = c.req.param('symbol');
    
    await removeFromWatchlist(c.env.DB, userId, symbol);
    return c.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    return c.json({ error: 'Server error' }, 500);
  }
});

export { watchlist as watchlistRoutes };
