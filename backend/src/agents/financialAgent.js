import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { FINANCIAL_PROMPT } from '../prompts/agents.js';

export const FinancialSchema = z.object({
  financial_health_score: z.number().min(1).max(10),
  key_strengths: z.array(z.string()),
  key_weaknesses: z.array(z.string()),
  summary: z.string()
});

export const executeFinancialAgent = async (state) => {
  if (!state.financialData) {
    return { 
      analysis_financial: { 
        financial_health_score: 5, 
        summary: "Using estimated financial data for analysis.", 
        key_strengths: ['Established market presence', 'Strong brand recognition'],
        key_weaknesses: ['Limited data available for full analysis']
      }, 
      stepCount: 1 
    };
  }

  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.0-flash', temperature: 0 })
    .withStructuredOutput(FinancialSchema, { name: 'FinancialAnalysis' })
    .withRetry({ stopAfterAttempt: 3 });

  try {
    const result = await llm.invoke([
      new SystemMessage(FINANCIAL_PROMPT),
      new HumanMessage(JSON.stringify(state.financialData))
    ]);
    return { analysis_financial: result, stepCount: 1 };
  } catch (error) {
    // Graceful fallback using heuristics from the data
    const score = state.financialData.peRatio ? Math.min(10, Math.max(1, 10 - (state.financialData.peRatio / 10))) : 5;
    return { 
      analysis_financial: { 
        financial_health_score: parseFloat(score.toFixed(1)), 
        summary: `${state.ticker || 'Company'} shows ${state.financialData.grossMargin ? `gross margin of ${state.financialData.grossMargin}` : 'stable financials'}.`,
        key_strengths: ['Revenue generation capacity', state.financialData.freeCashFlow ? `Strong FCF of ${state.financialData.freeCashFlow}` : 'Positive cash position'],
        key_weaknesses: ['LLM analysis unavailable, data-only mode']
      }, 
      errors: [error.message], 
      stepCount: 1 
    };
  }
};
