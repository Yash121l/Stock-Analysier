import axios from 'axios';

// API URL configuration - uses environment variable or defaults
const API_URL = process.env.REACT_APP_API_URL || 'https://stock-analysier-api.yashlunawat-tech.workers.dev/api';

// Helper function to get headers with token
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    };
};

export const getStockQuote = async (symbol) => {
    try {
        const response = await axios.get(
            `${API_URL}/stocks/quote/${symbol}`,
            getHeaders()
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch stock data');
    }
};

export const getStockHistory = async (symbol, duration = '1mo', interval = '1d') => {

    try {
        const response = await axios.get(
            `${API_URL}/stocks/history/${symbol}`,
            {
                ...getHeaders(),
                params: { duration, interval }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch historical data');
    }
};

export const searchStocks = async (query) => {
    try {
        const response = await axios.get(
            `${API_URL}/search/${query}`,
            getHeaders()
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to search stocks');
    }
};

export const getWatchlist = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/watchlist`,
            getHeaders()
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch watchlist');
    }
};

export const addToWatchlist = async (symbol) => {
    try {
        await axios.post(
            `${API_URL}/watchlist/${symbol}`,
            {},
            getHeaders()
        );
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add to watchlist');
    }
};

export const removeFromWatchlist = async (symbol) => {
    try {
        await axios.delete(
            `${API_URL}/watchlist/${symbol}`,
            getHeaders()
        );
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to remove from watchlist');
    }
};