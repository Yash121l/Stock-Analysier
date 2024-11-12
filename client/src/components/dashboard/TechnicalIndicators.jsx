import React from 'react';
import { Activity } from 'lucide-react';

const TechnicalIndicators = ({ data }) => {
    const getRSIColor = (value) => {
        if (value >= 70) return 'text-red-500';
        if (value <= 30) return 'text-green-500';
        return 'text-gray-900 dark:text-white';
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Technical Indicators
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                        Momentum Indicators
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400">RSI (14)</span>
                                <span className={`font-medium ${getRSIColor(data.rsi)}`}>
                                    {data.rsi.toFixed(2)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${data.rsi >= 70 ? 'bg-red-500' : data.rsi <= 30 ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${data.rsi}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">MACD</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {data.macd.value.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Signal</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {data.macd.signal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Histogram</span>
                                <span className={`font-medium ${data.macd.histogram > 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                    {data.macd.histogram.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                        Moving Averages
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">SMA 20</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                ${data.movingAverages.sma20.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">SMA 50</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                ${data.movingAverages.sma50.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">SMA 200</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                ${data.movingAverages.sma200.toFixed(2)}
                            </span>
                        </div>
                        <div className="pt-2 border-t dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Bollinger Bands
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Upper</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ${data.bollingerBands.upper.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Middle</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ${data.bollingerBands.middle.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Lower</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ${data.bollingerBands.lower.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicalIndicators;
