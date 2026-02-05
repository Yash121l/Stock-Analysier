import { Hono } from 'hono';
import { Env } from '../types';
import { verifyToken } from '../middleware/auth';
import { searchStocks } from '../lib/yahoo-finance';

const search = new Hono<{ Bindings: Env; Variables: { userId: number } }>();

// Apply auth middleware
search.use('*', verifyToken);

// Search stocks
search.get('/:query', async (c) => {
  try {
    const query = c.req.param('query');
    
    if (!query || query.trim().length < 1) {
      return c.json({ success: false, error: 'Search query is required' }, 400);
    }
    
    const results = await searchStocks(query);
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ success: false, error: 'Failed to perform search' }, 500);
  }
});

export { search as searchRoutes };
