process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testRawFetch() {
  const url1 = 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL';
  const url2 = 'https://www.google.com';
  
  try {
    const res2 = await fetch(url2);
    console.log("Google Status:", res2.status);
  } catch(e) { console.error("Google Fetch failed"); }

  try {
    const res1 = await fetch(url1, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log("Yahoo Status:", res1.status);
  } catch(e) { console.error("Yahoo Fetch failed"); }
}
testRawFetch();
