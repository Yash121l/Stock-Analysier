import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWatchlist, addToWatchlist as apiAddToWatchlist, removeFromWatchlist as apiRemoveFromWatchlist } from '../api/stocks';
import { useAuth } from './AuthContext';
import { track } from '../analytics';

const WatchlistContext = createContext(undefined);

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    const refreshWatchlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWatchlist([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getWatchlist();
            setWatchlist(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        refreshWatchlist();
    }, [refreshWatchlist]);

    const addToWatchlist = async (symbol) => {
        try {
            await apiAddToWatchlist(symbol);
            track('watchlist_stock_added', { symbol, watchlist_size: watchlist.length + 1 });
            await refreshWatchlist();
        } catch (err) {
            throw err;
        }
    };

    const removeFromWatchlist = async (symbol) => {
        try {
            await apiRemoveFromWatchlist(symbol);
            track('watchlist_stock_removed', { symbol, watchlist_size: Math.max(0, watchlist.length - 1) });
            await refreshWatchlist();
        } catch (err) {
            throw err;
        }
    };

    const isInWatchlist = (symbol) => {
        return watchlist.some(item => item.symbol === symbol);
    };

    return (
        <WatchlistContext.Provider
            value={{
                watchlist,
                loading,
                error,
                addToWatchlist,
                removeFromWatchlist,
                isInWatchlist,
                refreshWatchlist
            }}
        >
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};
