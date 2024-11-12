import React from 'react';
import PropTypes from 'prop-types';
import { TrendingDown, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

const KeyMetrics = ({ metrics }) => {
    const formatMarketCap = (value) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toFixed(2)}`;
    };

    const formatVolume = (value) => {
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
        return value.toString();
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Key Metrics</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatMarketCap(metrics.marketCap)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatVolume(metrics.volume)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Day High</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${metrics.dayHigh.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Day Low</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${metrics.dayLow.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

KeyMetrics.propTypes = {
    metrics: PropTypes.shape({
        marketCap: PropTypes.number.isRequired,
        volume: PropTypes.number.isRequired,
        dayHigh: PropTypes.number.isRequired,
        dayLow: PropTypes.number.isRequired,
        open: PropTypes.number.isRequired,
    }).isRequired,
};

export default KeyMetrics;
