import { fetchCompanyData } from '../tools/yahooFinance.js';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.0-flash', temperature: 0 });

export const executeResearchAgent = async (state) => {
  if (!state.is_valid) return { stepCount: 1 };
  
  const data = await fetchCompanyData(state.ticker);
  
  if (data.error) {
    return {
      financialData: null,
      newsData: [],
      errors: [data.error],
      stepCount: 1
    };
  }

  return {
    financialData: data.financials,
    newsData: data.news,
    stepCount: 1
  };
};
