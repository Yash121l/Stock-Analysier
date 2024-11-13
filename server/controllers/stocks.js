import yahooFinance from 'yahoo-finance2';

export const stockQuoteData = async (req, res) => {
    try {
        const { symbol } = req.params;
        const quote = await yahooFinance.quote(symbol);
        res.json(quote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
}

export const stockHistoryData = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { duration, interval } = req.query;

        const validIntervals = ['1d', '1wk', '1mo'];
        const intervalValue = validIntervals.includes(interval) ? interval : '1d';

        const endDate = new Date();

        let startDate = new Date();
        if (duration) {
            const durationMap = {
                '1d': 1, '5d': 7, '1mo': 30, '3mo': 90, '6mo': 180, '1y': 365, '2y': 730, '5y': 1825
            };
            const days = durationMap[duration];
            if (days) {
                startDate.setDate(startDate.getDate() - days);
            } else {
                return res.status(400).json({ error: 'Invalid duration format' });
            }
        } else {
            // Default to 1 year if no duration is provided
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        if (startDate > endDate) {
            return res.status(400).json({ error: 'Start date must be before end date' });
        }

        const queryOptions = {
            period1: startDate,
            period2: endDate,
            interval: intervalValue
        };

        // Fetch data from Yahoo Finance
        const result = await yahooFinance.chart(symbol, queryOptions);

        // Process and send the response
        const history = {
            symbol: result.meta.symbol,
            currency: result.meta.currency,
            data: result.quotes.map(quote => ({
                date: quote.date,
                open: quote.open,
                high: quote.high,
                low: quote.low,
                close: quote.close,
                volume: quote.volume,
                adjClose: quote.adjClose
            }))
        };

        res.json(history);
    } catch (error) {
        console.error('Yahoo Finance API Error:', error);
        res.status(500).json({
            error: 'Failed to fetch historical data',
            message: error.message
        });
    }
};
