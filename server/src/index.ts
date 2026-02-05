import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import { authRoutes } from './routes/auth';
import { stockRoutes } from './routes/stocks';
import { searchRoutes } from './routes/search';
import { watchlistRoutes } from './routes/watchlist';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => c.json({ status: 'ok', message: 'Stock Analysier API' }));

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/stocks', stockRoutes);
app.route('/api/search', searchRoutes);
app.route('/api/watchlist', watchlistRoutes);

// 404 handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;
