# Stock Analysis Platform Backend

## Overview

This is the backend for the Stock Analysis Platform, built using Express.js, MySQL, and Sequelize ORM. The platform provides a comprehensive set of features for analyzing and managing stock data.

## Features

- User authentication with Google OAuth (via Passport.js)
- Management of stock quotes, historical data, and user watchlists
- MySQL as the database with Sequelize ORM for schema definition and querying
- JWT-based authentication for secure API access
- Support for CRUD operations on stock data and user watchlists

## Getting Started

### Prerequisites

Before you begin, ensure you have the following dependencies installed:

- Node.js
- npm
- MySQL

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/stock-analysis-platform.git
   ```

2. **Install dependencies:**

   ```bash
   cd stock-analysis-platform/server
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=stock_analysis_db
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### Running the Application

To start the server, run:

```bash
npm start
```

The API will be available at `http://localhost:<PORT>` (default port: 3001).

## API Endpoints

### Authentication Endpoints

- **POST /auth/google** - Google login endpoint for user authentication.

### Stock Endpoints

- **GET /api/stocks/quote/:symbol** - Retrieves the current quote for a given stock symbol.
- **GET /api/stocks/history/:symbol** - Retrieves the historical data for a given stock symbol.

### Watchlist Endpoints

- **GET /api/watchlist** - Retrieves the user's current watchlist.
- **POST /api/watchlist/:symbol** - Adds a stock symbol to the user's watchlist.
- **DELETE /api/watchlist/:symbol** - Removes a stock symbol from the user's watchlist.

## Database

This backend uses MySQL for database management with Sequelize ORM for defining models and relationships.

### Database Models

1. **User Model**: Manages user details, including Google OAuth fields.
2. **Stock Model**: Stores stock quote and historical data.
3. **Watchlist Model**: Connects users to the stocks they have added to their watchlist.

## Middleware

- **authenticateUser**: Validates JWT for API access and assigns `req.user` with the authenticated user's information.
- **errorHandler**: Centralized error handler to catch and return standardized error responses.

## Testing

To run the tests for this backend, use the following command:

```bash
npm test
```

## Future Enhancements

- Integration with external financial data APIs for more comprehensive stock data.
- Implement real-time stock price updates using WebSockets.
- Add support for portfolio management and performance tracking.

## Contributing

Contributions are welcome! Please submit pull requests or open issues for suggestions or bug reports.

## Frontend Repository

[Frontend Implementation](https://github.com/your-username/stock-analysis-platform/tree/main/client)