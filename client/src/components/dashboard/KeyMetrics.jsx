import React from 'react';
import PropTypes from 'prop-types';
import { TrendingDown, TrendingUp, DollarSign, BarChart2, Activity, Clock } from 'lucide-react';

const KeyMetrics = ({ metrics }) => {
    const formatMarketCap = (value) => {
        if (!value || value === 0) return 'N/A';
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toFixed(2)}`;
    };

    const formatVolume = (value) => {
        if (!value || value === 0) return 'N/A';
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
        return value.toString();
    };

    const formatPrice = (value) => {
        if (!value || value === 0) return 'N/A';
        return `$${value.toFixed(2)}`;
    };

    const metricsData = [
        {
            label: 'Market Cap',
            value: formatMarketCap(metrics.marketCap),
            icon: DollarSign,
            bgColor: 'bg-blue-100 dark:bg-blue-900',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            label: 'Volume',
            value: formatVolume(metrics.volume),
            icon: BarChart2,
            bgColor: 'bg-purple-100 dark:bg-purple-900',
            iconColor: 'text-purple-600 dark:text-purple-400'
        },
        {
            label: 'Open',
            value: formatPrice(metrics.open),
            icon: Clock,
            bgColor: 'bg-indigo-100 dark:bg-indigo-900',
            iconColor: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            label: 'Previous Close',
            value: formatPrice(metrics.previousClose),
            icon: Activity,
            bgColor: 'bg-gray-100 dark:bg-gray-700',
            iconColor: 'text-gray-600 dark:text-gray-400'
        },
        {
            label: 'Day High',
            value: formatPrice(metrics.dayHigh),
            icon: TrendingUp,
            bgColor: 'bg-green-100 dark:bg-green-900',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        {
            label: 'Day Low',
            value: formatPrice(metrics.dayLow),
            icon: TrendingDown,
            bgColor: 'bg-red-100 dark:bg-red-900',
            iconColor: 'text-red-600 dark:text-red-400'
        },
        {
            label: '52 Week High',
            value: formatPrice(metrics.fiftyTwoWeekHigh),
            icon: TrendingUp,
            bgColor: 'bg-emerald-100 dark:bg-emerald-900',
            iconColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            label: '52 Week Low',
            value: formatPrice(metrics.fiftyTwoWeekLow),
            icon: TrendingDown,
            bgColor: 'bg-orange-100 dark:bg-orange-900',
            iconColor: 'text-orange-600 dark:text-orange-400'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Key Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metricsData.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="flex items-start gap-3">
                            <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                                <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {metric.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

KeyMetrics.propTypes = {
    metrics: PropTypes.shape({
        marketCap: PropTypes.number,
        volume: PropTypes.number,
        dayHigh: PropTypes.number,
        dayLow: PropTypes.number,
        open: PropTypes.number,
        previousClose: PropTypes.number,
        fiftyTwoWeekHigh: PropTypes.number,
        fiftyTwoWeekLow: PropTypes.number,
    }).isRequired,
};

export default KeyMetrics;
