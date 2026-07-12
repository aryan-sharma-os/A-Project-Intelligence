import YahooFinance from 'yahoo-finance2';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const yahooFinance = new YahooFinance();

async function testQuote() {
  try {
    const res = await yahooFinance.quote("AAPL");
    console.log("Yahoo Quote works:", res.regularMarketPrice);
  } catch (e) {
    console.error("Yahoo Quote Failed:", e);
  }
}
testQuote();
