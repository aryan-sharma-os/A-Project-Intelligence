import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { PLANNER_SYSTEM_PROMPT } from '../prompts/planner.js';
import logger from '../utils/logger.js';

export const PlannerSchema = z.object({
  ticker: z.string().describe('The extracted stock ticker symbol, 1-5 uppercase letters like AAPL, MSFT, TSLA'),
  is_valid: z.boolean().describe('True if the ticker is a real publicly traded company'),
  focus_areas: z.array(z.string()).describe('Specific areas the user wants researched'),
  error_message: z.string().nullable().describe('Error message if invalid')
});

const createLLM = (model = 'gemini-2.0-flash') => new ChatGoogleGenerativeAI({
  model,
  temperature: 0,
  maxRetries: 2,
});

export const executePlannerAgent = async (state) => {
  const userInput = JSON.stringify({ ticker: state.ticker, query: state.query });
  const startTime = Date.now();
  logger.info({ action: 'planner_agent_start', query: userInput }, 'Planner Agent Started');

  // Smart ticker extraction — if user typed a company name, try to convert it
  const ticker = state.ticker?.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);

  // Quick validation without LLM for simple cases (saves API quota)
  if (ticker && /^[A-Z]{1,5}$/.test(ticker)) {
    try {
      const llm = createLLM('gemini-2.0-flash')
        .withStructuredOutput(PlannerSchema, { name: 'PlannerResult' })
        .withRetry({ stopAfterAttempt: 3 });

      const result = await llm.invoke([
        new SystemMessage(PLANNER_SYSTEM_PROMPT),
        new HumanMessage(userInput)
      ]);

      logger.info({ action: 'planner_agent_success', result, durationMs: Date.now() - startTime }, 'Planner Agent OK');
      return { ...result, ticker: result.ticker?.toUpperCase() || ticker, stepCount: 1 };
    } catch (error) {
      logger.warn({ action: 'planner_agent_llm_failed', error: error.message }, 'LLM call failed, using heuristic fallback');
    }
  }

  // Heuristic fallback — validate ticker pattern without LLM
  const isValid = ticker && /^[A-Z]{1,5}$/.test(ticker);
  logger.info({ action: 'planner_agent_heuristic', ticker, is_valid: isValid }, 'Planner using heuristic');
  return {
    ticker: ticker || state.ticker,
    is_valid: isValid,
    focus_areas: [],
    error_message: isValid ? null : 'Could not validate ticker. Please use a stock symbol like AAPL or TSLA.',
    stepCount: 1
  };
};
