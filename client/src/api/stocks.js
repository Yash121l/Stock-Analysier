import axios from 'axios';

const API_URL = 'http://localhost:3333/api';

export const getStockQuote = async (symbol) => {
    try {
        const response = await axios.get(`${API_URL}/stocks/quote/${symbol}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch stock data');
    }
};

export const getStockHistory = async (symbol, period = '1mo', interval = '1d') => {
    try {
        const response = await axios.get(`${API_URL}/stocks/history/${symbol}`, {
            params: { period, interval },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch historical data');
    }
};

export const getWatchlist = async () => {
    try {
        const response = await axios.get(`${API_URL}/watchlist`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch watchlist');
    }
};

export const addToWatchlist = async (symbol) => {
    try {
        await axios.post(`${API_URL}/watchlist/${symbol}`, {}, { withCredentials: true });
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add to watchlist');
    }
};

export const removeFromWatchlist = async (symbol) => {
    try {
        await axios.delete(`${API_URL}/watchlist/${symbol}`, { withCredentials: true });
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to remove from watchlist');
    }
};
