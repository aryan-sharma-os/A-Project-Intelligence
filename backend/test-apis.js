process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testAPIs(ticker) {
  const url = `https://api.nasdaq.com/api/company/${ticker}/financials?frequency=1`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'PostmanRuntime/7.28.4' } });
    console.log("Nasdaq Financials Status:", res.status);
    const data = await res.json();
    console.log("Nasdaq Financials Data:", JSON.stringify(data.data?.incomeStatementTable?.rows?.slice(0,3), null, 2));
  } catch (e) {
    console.error("Nasdaq Financials Failed", e);
  }
}
testAPIs("AAPL");
