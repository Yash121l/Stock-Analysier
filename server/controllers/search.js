import yahooFinance from "yahoo-finance2";

export const searchData = async (query) => {
    try {
        const results = await yahooFinance.search(query);

        return {
            success: true,
            data: results.quotes
        };
    } catch (error) {
        console.error('Search error:', error);
        return {
            success: false,
            error: error.message || 'Failed to perform search'
        };
    }
};