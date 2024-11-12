import yahooFinance from "yahoo-finance2"

const stock = 'Tata Motors'
const results = await yahooFinance.chart('AAPL', {
    period1: '02-01-2024',
    period2: '02-01-2025',
    interval: '1d'
})
console.log(results);