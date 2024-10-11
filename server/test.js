// import yahooFinance from "yahoo-finance2";
// import { writeFile } from "fs/promises"; // Use the promises API to write the file asynchronously

// async function getHistoricalData(symbol) {
//     try {
//         const result = await yahooFinance.chart(symbol, {
//             period1: '2023-10-12',
//             period2: '2024-10-12',
//             interval: '1d',
//         });

//         const filePath = `${symbol}_historical_data.json`; // File name based on the symbol
//         await writeFile(filePath, JSON.stringify(result.quotes, null, 2), 'utf-8'); // Save result as JSON

//         console.log(`Historical data for ${symbol} saved to ${filePath}`);
//     } catch (error) {
//         console.error('Error fetching historical data:', error);
//     }
// }

// getHistoricalData('TATAMOTORS.NS');






// import yahooFinance from "yahoo-finance2";
// import { writeFile } from "fs/promises"; // Use the promises API to write the file asynchronously

// async function getRealTimeData(symbol) {
//     try {
//         const result = await yahooFinance.quoteSummary(symbol, {
//             modules: ['price', 'majorHoldersBreakdown', 'defaultKeyStatistics', 'institutionOwnership', 'fundOwnership']
//         });

//         console.log("Real-Time Data:");
//         console.log(`Current Price: $${result.price.regularMarketPrice}`);
//         console.log(`Market Cap: $${result.price.marketCap}`);
//         console.log(`P/E Ratio: ${result.defaultKeyStatistics.trailingPE}`);
//         console.log(`Volume: ${result.price.regularMarketVolume}`);
//         console.log(`Dividend Yield: ${result.defaultKeyStatistics.dividendYield}`);
//         console.log(`Insider Ownership: ${result.majorHoldersBreakdown.insidersPercentHeld * 100}%`);
//         console.log(`Institutional Ownership: ${result.majorHoldersBreakdown.institutionsPercentHeld * 100}%`);

//     } catch (error) {
//         console.error('Error fetching real-time data:', error);
//     }
// }

// async function getHistoricalData(symbol) {
//     try {
//         const result = await yahooFinance.chart(symbol, {
//             period1: '2023-01-01',
//             period2: '2024-10-12',
//             interval: '1d',
//         });

//         const filePath = `${symbol}_historical_data.json`; // File name based on the symbol
//         await writeFile(filePath, JSON.stringify(result.quotes, null, 2), 'utf-8'); // Save result as JSON

//         console.log(`Historical data for ${symbol} saved to ${filePath}`);

//         console.log("Historical Data:");
//         result.quotes.forEach(quote => {
//             console.log(`Date: ${quote.date}, Open: $${quote.open}, Close: $${quote.close}, Volume: ${quote.volume}`);
//         });

//     } catch (error) {
//         console.error('Error fetching historical data:', error);
//     }
// }

// async function getFinancialStatements(symbol) {
//     try {
//         const result = await yahooFinance.quoteSummary(symbol, {
//             modules: ['incomeStatementHistory', 'balanceSheetHistory', 'cashflowStatementHistory']
//         });

//         console.log("Financial Statements:");
//         console.log("Income Statement:", JSON.stringify(result.incomeStatementHistory, null, 2));
//         console.log("Balance Sheet:", JSON.stringify(result.balanceSheetHistory, null, 2));
//         console.log("Cash Flow Statement:", JSON.stringify(result.cashflowStatementHistory, null, 2));

//     } catch (error) {
//         console.error('Error fetching financial statements:', error);
//     }
// }

// async function getAnalystRecommendations(symbol) {
//     try {
//         const result = await yahooFinance.quoteSummary(symbol, {
//             modules: ['recommendationTrend']
//         });

//         if (result.recommendationTrend && result.recommendationTrend.length > 0) {
//             console.log("Analyst Recommendations:");
//             const recommendations = result.recommendationTrend;
//             recommendations.forEach(rec => {
//                 console.log(`Date: ${rec.period}, Rating: ${rec.rating}, Target Price: $${rec.targetMeanPrice}`);
//             });
//         } else {
//             console.log("No analyst recommendations data found.");
//         }

//     } catch (error) {
//         console.error('Error fetching analyst recommendations:', error);
//     }
// }

// async function getOwnershipData(symbol) {
//     try {
//         const result = await yahooFinance.quoteSummary(symbol, {
//             modules: ['institutionOwnership', 'fundOwnership']
//         });

//         console.log("Ownership Data:");
//         const institutionsData = result.institutionOwnership.ownershipList;
//         const fundData = result.fundOwnership.ownershipList;

//         console.log("Institutional Ownership:");
//         institutionsData.forEach(ownership => {
//             console.log(`${ownership.organization}: ${ownership.position.directHolderPercent}%`);
//         });

//         console.log("\nFund Ownership:");
//         fundData.forEach(ownership => {
//             console.log(`${ownership.organization}: ${ownership.position.directHolderPercent}%`);
//         });

//     } catch (error) {
//         console.error('Error fetching ownership data:', error);
//     }
// }

// async function getNewsData(symbol) {
//     try {
//         const result = await yahooFinance.quoteSummary(symbol, {
//             modules: ['news']
//         });

//         if (result.news && result.news.length > 0) {
//             console.log("Recent News:");
//             result.news.forEach(article => {
//                 console.log(`Title: ${article.title}, Link: ${article.link}, Date: ${new Date(article.providerPublishTime * 1000).toLocaleString()}`);
//             });
//         } else {
//             console.log("No news articles found.");
//         }

//     } catch (error) {
//         console.error('Error fetching news data:', error);
//     }
// }

// // Main function to call all data fetching functions
// async function main(symbol) {
//     await getRealTimeData(symbol);
//     await getHistoricalData(symbol);
//     await getFinancialStatements(symbol);
//     await getAnalystRecommendations(symbol);
//     await getOwnershipData(symbol);
//     await getNewsData(symbol);
// }

// // Example usage
// main('TATAMOTORS.NS'); // Replace with the symbol of the stock you're interested in
