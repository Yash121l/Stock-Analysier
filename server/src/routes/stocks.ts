import { Hono } from 'hono';
import { Env } from '../types';
import { verifyToken } from '../middleware/auth';
import { getQuote, getHistory } from '../lib/yahoo-finance';

const stocks = new Hono<{ Bindings: Env; Variables: { userId: number } }>();

// Apply auth middleware to all routes
stocks.use('*', verifyToken);

// Get stock quote
stocks.get('/quote/:symbol', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    const quote = await getQuote(symbol);
    return c.json(quote);
  } catch (error) {
    console.error('Quote error:', error);
    return c.json({ error: 'Failed to fetch stock data' }, 500);
  }
});

// Get stock history
stocks.get('/history/:symbol', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    const duration = c.req.query('duration') || '1mo';
    const interval = c.req.query('interval') || '1d';
    
    const history = await getHistory(symbol, duration, interval);
    return c.json(history);
  } catch (error) {
    console.error('History error:', error);
    return c.json({ error: 'Failed to fetch historical data' }, 500);
  }
});

export { stocks as stockRoutes };
