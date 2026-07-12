import yahooFinance from 'yahoo-finance2';

export const getFinancialStatements = async (ticker) => {
  try {
    const quote = await yahooFinance.quote(ticker);
    const quoteSummary = await yahooFinance.quoteSummary(ticker, {
      modules: ['financialData', 'defaultKeyStatistics']
    });

    return {
      status: 'success',
      data: {
        price: quote.regularMarketPrice,
        currency: quote.currency,
        financialData: quoteSummary.financialData,
        keyStatistics: quoteSummary.defaultKeyStatistics
      }
    };
  } catch (error) {
    console.error(`Error fetching financials for ${ticker}:`, error);
    return { status: 'error', message: error.message, data: null };
  }
};
