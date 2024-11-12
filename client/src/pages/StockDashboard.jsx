import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getStockQuote, getStockHistory } from '../api/stocks';
import StockHeader from '../components/dashboard/StockHeader';
import KeyMetrics from '../components/dashboard/KeyMetrics';
import PriceChart from '../components/dashboard/PriceChart';
import VolumeChart from '../components/dashboard/VolumeChart';
import WatchlistButton from '../components/dashboard/WatchlistButton';

const HISTORY_TIMEFRAMES = {
    daily: { period: '1d', interval: '5m' },
    weekly: { period: '5d', interval: '15m' },
    monthly: { period: '1mo', interval: '1d' },
    quarterly: { period: '3mo', interval: '1d' },
    yearly: { period: '1y', interval: '1d' },
    fiveYear: { period: '5y', interval: '1d' }
};

const REFRESH_INTERVAL = 600000; // 10 minutes in milliseconds

const StockDashboard = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const fetchData = useCallback(async () => {
        if (!symbol) {
            setError('No stock symbol provided');
            setLoading(false);
            return;
        }

        try {
            setError(null);

            // Fetch quote data
            const quote = await getStockQuote(symbol);

            // Fetch historical data for all timeframes
            const historyPromises = Object.entries(HISTORY_TIMEFRAMES).map(([key, { period, interval }]) =>
                getStockHistory(symbol, period, interval).catch((err) => {
                    console.error(`Error fetching ${key} history:`, err);
                    return { symbol, currency: 'USD', data: [] };
                })
            );

            const [daily, weekly, monthly, quarterly, yearly, fiveYear] = await Promise.all(historyPromises);

            setData({
                quote,
                histories: {
                    daily,
                    weekly,
                    monthly,
                    quarterly,
                    yearly,
                    fiveYear
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
            console.error('Stock data fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [symbol]);

    useEffect(() => {
        fetchData();

        // Set up auto-refresh
        const intervalId = setInterval(fetchData, REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    if (!symbol) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">Invalid stock symbol</p>
                <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 mx-auto"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load stock data'}</p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Search
                    </button>
                    <button
                        onClick={fetchData}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Get the latest data point from daily history
    const latestDailyData = data.histories.daily.data[data.histories.daily.data.length - 1] || {};

    // Transform historical data for PriceChart
    const chartData = {
        daily: data.histories.daily.data,
        weekly: data.histories.weekly.data,
        monthly: data.histories.monthly.data,
        quarterly: data.histories.quarterly.data,
        yearly: data.histories.yearly.data,
        fiveYear: data.histories.fiveYear.data
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 px-4 py-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                </button>
                <WatchlistButton symbol={symbol} />
            </div>

            <div className="grid gap-6">
                <StockHeader
                    symbol={data.quote.symbol}
                    companyName={data.quote.longName || data.quote.shortName}
                    price={data.quote.regularMarketPrice}
                    change={data.quote.regularMarketChange}
                    changePercent={data.quote.regularMarketChangePercent}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <KeyMetrics
                        metrics={{
                            marketCap: data.quote.marketCap,
                            volume: data.quote.regularMarketVolume,
                            dayHigh: latestDailyData.high || 0,
                            dayLow: latestDailyData.low || 0,
                            open: data.histories.daily.data[0]?.open || 0,
                        }}
                    />
                    <VolumeChart data={data.histories.monthly.data} />
                </div>

                <PriceChart data={chartData} />
            </div>
        </div>
    );
};

export default StockDashboard;
