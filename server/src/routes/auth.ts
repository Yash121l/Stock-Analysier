import { Hono } from 'hono';
import * as jose from 'jose';
import { z } from 'zod';
import { Env } from '../types';
import { findUserByEmail, createUser, hashPassword, verifyPassword } from '../lib/db';

const auth = new Hono<{ Bindings: Env }>();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Helper to create JWT token
async function createToken(userId: number, secret: string): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  const token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secretKey);
  return token;
}

// Register
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validation = registerSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({ error: validation.error.issues[0].message }, 400);
    }
    
    const { email, password } = validation.data;
    
    // Check if user exists
    const existingUser = await findUserByEmail(c.env.DB, email);
    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await createUser(c.env.DB, email, hashedPassword);
    
    // Create token
    const token = await createToken(user.id, c.env.JWT_SECRET);
    
    return c.json({ message: 'Registration successful', token }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Server error' }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      return c.json({ error: validation.error.issues[0].message }, 400);
    }
    
    const { email, password } = validation.data;
    
    // Find user
    const user = await findUserByEmail(c.env.DB, email);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Verify password
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Create token
    const token = await createToken(user.id, c.env.JWT_SECRET);
    
    return c.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Server error' }, 500);
  }
});

// Logout
auth.post('/logout', (c) => {
  return c.json({ message: 'Logout successful' });
});

export { auth as authRoutes };
