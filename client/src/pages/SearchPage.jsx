import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { searchStocks } from '../api/stocks';

const SearchPage = () => {
    const [symbol, setSymbol] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (symbol.trim().length < 1) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchStocks(symbol);
                if (data.success) {
                    setSuggestions(data.data.filter(item => item.symbol));
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [symbol]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (symbol.trim()) {
            navigate(`/stock/${symbol.toUpperCase()}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        navigate(`/stock/${suggestion.symbol}`);
    };

    return (
        <div className="max-w-4xl mx-auto mt-12">
            <div className="text-center mb-12">
                <TrendingUp className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Stock Market Analysis
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Enter a stock symbol to view detailed market analysis
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
                <div className="relative">
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Enter stock symbol (e.g., AAPL)"
                        className="w-full px-4 py-3 pl-12 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    {isLoading && (
                        <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5 animate-spin" />
                    )}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                        {suggestions.map((suggestion) => (
                            <div
                                key={suggestion.symbol}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {suggestion.symbol}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {suggestion.shortname}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {suggestion.exchDisp}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                >
                    Analyze Stock
                </button>
            </form>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {['AAPL', 'GOOGL', 'MSFT'].map((stock) => (
                    <div
                        key={stock}
                        onClick={() => navigate(`/stock/${stock}`)}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{stock}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Click to view analysis</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;