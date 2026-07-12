process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function scrapeYahoo(ticker) {
  try {
    const url = `https://finance.yahoo.com/quote/${ticker}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log("Status:", res.status);
    const html = await res.text();
    
    // Attempt to parse fin-streamer or specific data-test attributes
    const peMatch = html.match(/data-field="trailingPE"[^>]*>([\d.]+)</);
    const capMatch = html.match(/data-field="marketCap"[^>]*>([^<]+)</);
    const epsMatch = html.match(/data-field="epsTrailingTwelveMonths"[^>]*>([\d.]+)</);
    
    console.log("P/E:", peMatch ? peMatch[1] : "Not found");
    console.log("Market Cap:", capMatch ? capMatch[1] : "Not found");
    console.log("EPS:", epsMatch ? epsMatch[1] : "Not found");
    
    if(!peMatch) {
      console.log("HTML length:", html.length);
      console.log("HTML snippet:", html.substring(10000, 10200));
    }
  } catch (e) {
    console.error(e);
  }
}
scrapeYahoo("AAPL");
