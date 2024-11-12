import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const VolumeChart = ({ data }) => {
    const { theme } = useTheme();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const formatVolume = (value) => {
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
        return value.toString();
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Trading Volume</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                        />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
                        />
                        <YAxis
                            tickFormatter={formatVolume}
                            stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                color: theme === 'dark' ? '#ffffff' : '#000000',
                            }}
                            formatter={(value) => [formatVolume(value), 'Volume']}
                            labelFormatter={formatDate}
                        />
                        <Bar
                            dataKey="volume"
                            fill={theme === 'dark' ? '#60a5fa' : '#3b82f6'}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VolumeChart;
