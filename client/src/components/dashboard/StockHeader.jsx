import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockHeader = ({ symbol, companyName, price, change, changePercent }) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{companyName}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-2">
                        {isPositive ? (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <p
                            className={`text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'
                                }`}
                        >
                            {change >= 0 ? '+' : ''}
                            {change.toFixed(2)} ({changePercent.toFixed(2)}%)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockHeader;
