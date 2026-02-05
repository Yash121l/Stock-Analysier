import { User, D1Database } from '../types';

// Hash password using Web Crypto API (Workers compatible)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Import password as key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  // Combine salt and hash
  const hashArray = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  
  // Return as base64
  return btoa(String.fromCharCode(...combined));
}

// Verify password
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Decode stored hash
  const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
  const salt = combined.slice(0, 16);
  const storedHashBytes = combined.slice(16);
  
  // Import password as key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive key using same parameters
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const hashArray = new Uint8Array(derivedBits);
  
  // Compare hashes
  if (hashArray.length !== storedHashBytes.length) return false;
  for (let i = 0; i < hashArray.length; i++) {
    if (hashArray[i] !== storedHashBytes[i]) return false;
  }
  return true;
}

// Database operations
export async function findUserByEmail(db: D1Database, email: string): Promise<User | null> {
  const result = await db.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first<User>();
  return result;
}

export async function findUserById(db: D1Database, id: number): Promise<User | null> {
  const result = await db.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(id).first<User>();
  return result;
}

export async function createUser(db: D1Database, email: string, hashedPassword: string): Promise<User> {
  const result = await db.prepare(
    'INSERT INTO users (email, password) VALUES (?, ?) RETURNING *'
  ).bind(email.toLowerCase(), hashedPassword).first<User>();
  
  if (!result) {
    throw new Error('Failed to create user');
  }
  return result;
}

// Watchlist operations
export async function getWatchlist(db: D1Database, userId: number): Promise<string[]> {
  const results = await db.prepare(
    'SELECT symbol FROM watchlist WHERE user_id = ?'
  ).bind(userId).all();
  
  return results.results.map((row: any) => row.symbol);
}

export async function addToWatchlist(db: D1Database, userId: number, symbol: string): Promise<void> {
  await db.prepare(
    'INSERT OR IGNORE INTO watchlist (user_id, symbol) VALUES (?, ?)'
  ).bind(userId, symbol.toUpperCase()).run();
}

export async function removeFromWatchlist(db: D1Database, userId: number, symbol: string): Promise<void> {
  await db.prepare(
    'DELETE FROM watchlist WHERE user_id = ? AND symbol = ?'
  ).bind(userId, symbol.toUpperCase()).run();
}
