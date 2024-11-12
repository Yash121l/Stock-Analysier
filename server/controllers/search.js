import yahooFinance from "yahoo-finance2"

export default serachStock = async(req, res) => {
    const stock = 'AAPL'
    const results = await yahooFinance.search(stock);
    console.log(results);
    
}