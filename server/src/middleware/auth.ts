import { Context, Next } from 'hono';
import * as jose from 'jose';
import { Env } from '../types';

// Define custom variables that will be set on the context
type Variables = {
  userId: number;
};

export const verifyToken = async (c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Set userId in context for later use
    c.set('userId', payload.userId as number);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};
