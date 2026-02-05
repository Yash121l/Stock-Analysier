import { StockQuote, StockHistory, StockHistoryData } from '../types';

// Yahoo Finance API endpoints
const YAHOO_CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';
const YAHOO_SEARCH_URL = 'https://query2.finance.yahoo.com/v1/finance/search';
const YAHOO_QUOTE_URL = 'https://query2.finance.yahoo.com/v7/finance/quote';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

// Fetch stock quote using multiple endpoints for complete data
export async function getQuote(symbol: string): Promise<StockQuote> {
  // Try v7 quote API first (has more complete data including market cap)
  try {
    const quoteUrl = `${YAHOO_QUOTE_URL}?symbols=${symbol}`;
    const quoteResponse = await fetch(quoteUrl, { headers: HEADERS });
    
    if (quoteResponse.ok) {
      const quoteData = await quoteResponse.json() as any;
      const quote = quoteData.quoteResponse?.result?.[0];
      
      if (quote) {
        return {
          symbol: quote.symbol,
          shortName: quote.shortName || quote.longName || symbol,
          regularMarketPrice: quote.regularMarketPrice || 0,
          regularMarketChange: quote.regularMarketChange || 0,
          regularMarketChangePercent: quote.regularMarketChangePercent || 0,
          regularMarketVolume: quote.regularMarketVolume || 0,
          regularMarketOpen: quote.regularMarketOpen || 0,
          regularMarketDayHigh: quote.regularMarketDayHigh || 0,
          regularMarketDayLow: quote.regularMarketDayLow || 0,
          regularMarketPreviousClose: quote.regularMarketPreviousClose || 0,
          marketCap: quote.marketCap || 0,
          fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
          fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
        };
      }
    }
  } catch (error) {
    console.error('v7 quote API failed, falling back to chart API:', error);
  }
  
  // Fallback to chart API
  const url = `${YAHOO_CHART_URL}/${symbol}?interval=1d&range=1d`;
  
  const response = await fetch(url, { headers: HEADERS });
  
  if (!response.ok) {
    const text = await response.text();
    console.error('Yahoo API error:', response.status, text);
    throw new Error(`Failed to fetch quote for ${symbol}: ${response.status}`);
  }
  
  const data = await response.json() as any;
  const result = data.chart?.result?.[0];
  
  if (!result) {
    throw new Error(`No data found for ${symbol}`);
  }
  
  const meta = result.meta;
  const quotes = result.indicators?.quote?.[0];
  
  const lastIndex = (result.timestamp?.length || 1) - 1;
  const previousClose = meta.chartPreviousClose || meta.previousClose || 0;
  const currentPrice = meta.regularMarketPrice || quotes?.close?.[lastIndex] || 0;
  const change = currentPrice - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;
  
  return {
    symbol: meta.symbol,
    shortName: meta.shortName || meta.longName || symbol,
    regularMarketPrice: currentPrice,
    regularMarketChange: change,
    regularMarketChangePercent: changePercent,
    regularMarketVolume: meta.regularMarketVolume || quotes?.volume?.[lastIndex] || 0,
    regularMarketOpen: quotes?.open?.[lastIndex] || meta.regularMarketOpen || 0,
    regularMarketDayHigh: meta.regularMarketDayHigh || quotes?.high?.[lastIndex] || 0,
    regularMarketDayLow: meta.regularMarketDayLow || quotes?.low?.[lastIndex] || 0,
    regularMarketPreviousClose: previousClose,
    marketCap: 0, // Not available in chart API fallback
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
  };
}

// Fetch stock history
export async function getHistory(
  symbol: string,
  duration: string = '1mo',
  interval: string = '1d'
): Promise<StockHistory> {
  const durationMap: Record<string, string> = {
    '1d': '1d',
    '5d': '5d',
    '1mo': '1mo',
    '3mo': '3mo',
    '6mo': '6mo',
    '1y': '1y',
    '2y': '2y',
    '5y': '5y',
  };
  
  const range = durationMap[duration] || '1mo';
  const validInterval = ['1d', '1wk', '1mo'].includes(interval) ? interval : '1d';
  
  const url = `${YAHOO_CHART_URL}/${symbol}?range=${range}&interval=${validInterval}`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    const text = await response.text();
    console.error('Yahoo API error:', response.status, text);
    throw new Error(`Failed to fetch history for ${symbol}: ${response.status}`);
  }
  
  const data = await response.json() as any;
  const result = data.chart?.result?.[0];
  
  if (!result) {
    throw new Error(`No history data found for ${symbol}`);
  }
  
  const timestamps = result.timestamp || [];
  const quotes = result.indicators?.quote?.[0] || {};
  const adjClose = result.indicators?.adjclose?.[0]?.adjclose || [];
  
  const historyData: StockHistoryData[] = timestamps.map((timestamp: number, i: number) => ({
    date: new Date(timestamp * 1000).toISOString(),
    open: quotes.open?.[i] || 0,
    high: quotes.high?.[i] || 0,
    low: quotes.low?.[i] || 0,
    close: quotes.close?.[i] || 0,
    volume: quotes.volume?.[i] || 0,
    adjClose: adjClose[i] || quotes.close?.[i] || 0,
  }));
  
  return {
    symbol: result.meta?.symbol || symbol,
    currency: result.meta?.currency || 'USD',
    data: historyData.filter(d => d.close !== 0 && d.close !== null),
  };
}

// Search stocks
export async function searchStocks(query: string): Promise<any[]> {
  const url = `${YAHOO_SEARCH_URL}?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    const text = await response.text();
    console.error('Yahoo search error:', response.status, text);
    throw new Error(`Search failed for ${query}`);
  }
  
  const data = await response.json() as any;
  return data.quotes || [];
}

// Get quote for watchlist display
export async function getQuoteForWatchlist(symbol: string): Promise<{
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}> {
  try {
    const quote = await getQuote(symbol);
    return {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
    };
  } catch (error) {
    console.error(`Failed to fetch quote for ${symbol}:`, error);
    return {
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
    };
  }
}
