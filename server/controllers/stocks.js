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
        const { period1, period2, interval } = req.query;

        const validIntervals = ['1d', '1wk', '1mo'];
        const intervalValue = validIntervals.includes(interval) ? interval : '1d';

        const endDate = period2 ? new Date(period2) : new Date();

        let startDate;
        if (period1) {
            startDate = new Date(period1);
        } else {
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

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

        const result = await yahooFinance.chart(symbol, queryOptions);

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
}