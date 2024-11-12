import React, { useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const TimeRanges = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

const PriceChart = ({ data }) => {
    const [timeRange, setTimeRange] = useState('1M');
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    console.log(data);

    const chartData = useMemo(() => {
        const dataMap = {
            '1D': data.daily,
            '1W': data.weekly,
            '1M': data.monthly,
            '3M': data.quarterly,
            '1Y': data.yearly,
            '5Y': data.fiveYear
        };

        const selectedData = [...(dataMap[timeRange] || [])];

        if (selectedData.length > 0) {
            const initialPrice = selectedData[0].close;
            return selectedData.map(point => ({
                ...point,
                percentChange: ((point.close - initialPrice) / initialPrice) * 100
            }));
        }

        return selectedData;
    }, [data, timeRange]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const formatOptions = {
            '1D': { hour: 'numeric', minute: '2-digit', hour12: true },
            '1W': { weekday: 'short', hour: 'numeric', hour12: true },
            '1M': { month: 'short', day: 'numeric' },
            '3M': { month: 'short', day: 'numeric' },
            '1Y': { month: 'short', year: 'numeric' },
            '5Y': { month: 'short', year: 'numeric' }
        };

        return new Intl.DateTimeFormat('en-US', formatOptions[timeRange]).format(date);
    };

    const formatTooltipContent = (dataPoint) => {
        if (!dataPoint.date) return "No date available";
        const date = new Date(dataPoint.date);
        if (isNaN(date.getTime())) return "Invalid date";

        const formatOptions = {
            '1D': { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true },
            '1W': { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', hour12: true },
            default: { month: 'long', day: 'numeric', year: 'numeric' }
        };

        const dateFormat = formatOptions[timeRange] || formatOptions.default;
        return new Intl.DateTimeFormat('en-US', dateFormat).format(date);
    };

    const getChartDomain = useMemo(() => {
        if (!chartData.length) return { min: 0, max: 0 };

        const prices = chartData.map(d => d.close);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const padding = (max - min) * 0.05;

        return {
            min: Math.max(0, Math.floor((min - padding) * 100) / 100),
            max: Math.ceil((max + padding) * 100) / 100
        };
    }, [chartData]);

    const getPriceChangeColor = (change) => {
        return change >= 0
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400';
    };

    const priceChange = useMemo(() => {
        if (chartData.length < 2) return { value: 0, percentage: 0 };
        const first = chartData[0].close;
        const last = chartData[chartData.length - 1].close;
        return {
            value: last - first,
            percentage: ((last - first) / first) * 100
        };
    }, [chartData]);

    if (!chartData.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="h-[400px] flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No data available for this time range
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Price History
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={getPriceChangeColor(priceChange.value)}>
                            ${Math.abs(priceChange.value).toFixed(2)}
                            &nbsp;({priceChange.percentage.toFixed(2)}%)
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            {timeRange} Change
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {TimeRanges.map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${timeRange === range
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={priceChange.value >= 0 ? '#22c55e' : '#ef4444'}
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={priceChange.value >= 0 ? '#22c55e' : '#ef4444'}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
                            tick={{ fontSize: 12 }}
                            minTickGap={30}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
                            domain={[getChartDomain.min, getChartDomain.max]}
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                            tick={{ fontSize: 12 }}
                            width={80}
                            padding={{ top: 10, bottom: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#ffffff' : '#000000',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            labelFormatter={formatTooltipContent}
                            formatter={(value, name) => {
                                if (name === 'close') return [`$${value.toFixed(2)}`, 'Price'];
                                if (name === 'percentChange') return [`${value.toFixed(2)}%`, 'Change'];
                                return [value, name];
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="close"
                            stroke={priceChange.value >= 0 ? '#22c55e' : '#ef4444'}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            isAnimationActive={true}
                            animationDuration={750}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PriceChart;
