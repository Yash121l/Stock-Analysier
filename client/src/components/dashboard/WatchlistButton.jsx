import React from 'react';
import { Star } from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';

const WatchlistButton = ({ symbol }) => {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
    const inWatchlist = isInWatchlist(symbol);

    return (
        <button
            onClick={() => inWatchlist ? removeFromWatchlist(symbol) : addToWatchlist(symbol)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${inWatchlist
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
        >
            <Star className="h-5 w-5" fill={inWatchlist ? 'currentColor' : 'none'} />
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </button>
    );
};

export default WatchlistButton;
