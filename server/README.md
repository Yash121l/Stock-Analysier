# Stock Analysier API (Cloudflare Workers)

A serverless stock analysis API built with **Hono** on **Cloudflare Workers**, using **D1** (SQLite) for the database.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: [Hono](https://hono.dev) - Fast, lightweight web framework
- **Database**: Cloudflare D1 (SQLite)
- **Auth**: JWT with [jose](https://github.com/panva/jose)
- **Validation**: [Zod](https://zod.dev)

## Project Structure

```
server/
├── src/
│   ├── index.ts          # Main app entry
│   ├── types.ts          # TypeScript types
│   ├── middleware/
│   │   └── auth.ts       # JWT verification
│   ├── lib/
│   │   ├── db.ts         # D1 database operations
│   │   └── yahoo-finance.ts  # Stock data API
│   └── routes/
│       ├── auth.ts       # Auth endpoints
│       ├── stocks.ts     # Stock data endpoints
│       ├── search.ts     # Search endpoints
│       └── watchlist.ts  # Watchlist endpoints
├── schema.sql            # D1 database schema
├── wrangler.toml         # Workers configuration
├── package.json
└── tsconfig.json
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Stocks (Protected)

- `GET /api/stocks/quote/:symbol` - Get stock quote
- `GET /api/stocks/history/:symbol` - Get stock history

### Search (Protected)

- `GET /api/search/:query` - Search stocks

### Watchlist (Protected)

- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist/:symbol` - Add to watchlist
- `DELETE /api/watchlist/:symbol` - Remove from watchlist

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete deployment instructions.

```bash
# Quick deploy
npm run deploy
```

## Environment Variables

Set via `wrangler secret`:

- `JWT_SECRET` - Secret for JWT signing

Set via `wrangler.toml`:

- `FRONTEND_URL` - Frontend URL for CORS
