import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { Star, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const WatchlistPage = () => {
    const { watchlist, loading, error, refreshWatchlist } = useWatchlist();
    const navigate = useNavigate();

    const formatMarketCap = (value) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        return `$${(value / 1e6).toFixed(2)}M`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                    onClick={() => refreshWatchlist()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (watchlist.length === 0) {
        return (
            <div className="text-center py-16">
                <Star className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Your watchlist is empty
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add stocks to your watchlist to track them here
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Search Stocks
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Watchlist
                </h1>
                <button
                    onClick={() => refreshWatchlist()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <div className="grid gap-4">
                {watchlist.map((stock) => (
                    <div
                        key={stock.symbol}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/stock/${stock.symbol}`)}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {stock.symbol}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {stock.shortName}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${stock.price.toFixed(2)}
                                </p>
                                <div className="flex items-center justify-end space-x-2">
                                    {stock.change >= 0 ? (
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-5 w-5 text-red-500" />
                                    )}
                                    <span
                                        className={`${stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                                            }`}
                                    >
                                        {stock.change >= 0 ? '+' : ''}
                                        {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                                <span>Volume: {stock.volume.toLocaleString()}</span>
                                <span>Market Cap: {formatMarketCap(stock.marketCap)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchlistPage;
