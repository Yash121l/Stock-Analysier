import React from 'react';
import PropTypes from 'prop-types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const InsiderActivity = ({ trades }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Insider Activity
            </h2>

            <div className="space-y-4">
                {trades.map((trade, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                        <div className="flex items-center space-x-4">
                            <div
                                className={`p-2 rounded-full ${trade.type === 'Buy'
                                        ? 'bg-green-100 dark:bg-green-900'
                                        : 'bg-red-100 dark:bg-red-900'
                                    }`}
                            >
                                {trade.type === 'Buy' ? (
                                    <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{trade.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{trade.position}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {trade.shares.toLocaleString()} shares
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                @ ${trade.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

InsiderActivity.propTypes = {
    trades: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['Buy', 'Sell']).isRequired,
            shares: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default InsiderActivity;
