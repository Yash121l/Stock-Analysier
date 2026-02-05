# Stock Analysier - Cloudflare Deployment Guide

Complete step-by-step guide to deploy Stock Analysier on Cloudflare Workers (API) and Cloudflare Pages (Frontend).

---

## Prerequisites

1. **Cloudflare Account**: Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Node.js**: v18+ installed
3. **Wrangler CLI**: Will be installed as dev dependency

---

## Part 1: Backend Deployment (Cloudflare Workers)

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser window - authorize the Wrangler CLI.

### Step 3: Create D1 Database

```bash
# Create the database
npx wrangler d1 create stock-analysier-db
```

**Important**: Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "stock-analysier-db"
database_id = "YOUR_ACTUAL_DATABASE_ID"  # ← Paste here
```

### Step 4: Run Database Migrations

```bash
# Run migrations locally for testing
npm run db:migrate:local

# Run migrations on production
npm run db:migrate
```

### Step 5: Set JWT Secret

```bash
npx wrangler secret put JWT_SECRET
# Enter a secure random string when prompted (32+ characters)
```

### Step 6: Test Locally

```bash
npm run dev
```

API available at: `http://localhost:8787`

### Step 7: Deploy to Production

```bash
npm run deploy
```

**Note your Worker URL**: `https://stock-analysier-api.<your-subdomain>.workers.dev`

---

## Part 2: Frontend Deployment (Cloudflare Pages)

### Step 1: Set API URL Environment Variable

Create `.env.production` in the `client` folder:

```bash
cd client
echo "REACT_APP_API_URL=https://stock-analysier-api.<your-subdomain>.workers.dev/api" > .env.production
```

### Step 2: Build the Frontend

```bash
npm install
npm run build
```

### Step 3: Deploy to Cloudflare Pages

#### Option A: Via Wrangler CLI

```bash
npx wrangler pages deploy build --project-name=stock-analysier
```

#### Option B: Via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Click **Create a project** → **Upload assets**
3. Upload the `build` folder
4. Set project name: `stock-analysier`

---

## Part 3: Update CORS (Important!)

After deployment, update the `wrangler.toml` with your Pages URL:

```toml
[env.production]
vars = { FRONTEND_URL = "https://stock-analysier.pages.dev" }
```

Then redeploy:

```bash
cd server
npm run deploy
```

---

## Environment Variables Summary

### Workers (via wrangler secrets)

| Variable     | Description            | Command                              |
| ------------ | ---------------------- | ------------------------------------ |
| `JWT_SECRET` | Secret for JWT signing | `npx wrangler secret put JWT_SECRET` |

### Workers (via wrangler.toml)

| Variable       | Description           |
| -------------- | --------------------- |
| `FRONTEND_URL` | Frontend URL for CORS |

### Pages (via .env.production)

| Variable            | Description     |
| ------------------- | --------------- |
| `REACT_APP_API_URL` | Backend API URL |

---

## Quick Commands Reference

```bash
# Backend (server folder)
npm run dev         # Local development
npm run deploy      # Deploy to Cloudflare Workers
npm run db:create   # Create D1 database
npm run db:migrate  # Apply schema to production
npm run db:migrate:local  # Apply schema locally

# Frontend (client folder)
npm run start       # Local development
npm run build       # Build for production
npx wrangler pages deploy build --project-name=stock-analysier  # Deploy to Pages
```

---

## Troubleshooting

### "Cannot find module" errors

Run `npm install` in the `server` folder.

### Database not found

1. Verify `database_id` in `wrangler.toml` matches your D1 database
2. Run `npx wrangler d1 list` to see all databases

### CORS errors

1. Check `FRONTEND_URL` in `wrangler.toml` matches your Pages URL
2. Redeploy Workers after updating

### JWT errors

1. Ensure `JWT_SECRET` is set: `npx wrangler secret list`
2. Re-set if needed: `npx wrangler secret put JWT_SECRET`

---

## Custom Domain Setup (Optional)

### For Workers API:

1. Dashboard → Workers → your worker → **Triggers** → **Add Custom Domain**

### For Pages Frontend:

1. Dashboard → Pages → your project → **Custom domains** → **Add**
