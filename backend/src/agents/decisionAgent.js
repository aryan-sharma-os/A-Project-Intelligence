import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { DECISION_PROMPT } from '../prompts/agents.js';

export const DecisionSchema = z.object({
  recommendation: z.enum(['BUY', 'HOLD', 'SELL']),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  justification: z.string()
});

export const executeDecisionAgent = async (state) => {
  const context = JSON.stringify({
    ticker: state.ticker,
    financial: state.analysis_financial,
    news: state.analysis_news,
    risk: state.analysis_risk,
    raw_financials: {
      price: state.financialData?.price,
      peRatio: state.financialData?.peRatio,
      revenueGrowth: state.financialData?.revenueGrowth,
      grossMargin: state.financialData?.grossMargin
    }
  });

  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.0-flash', temperature: 0 })
    .withStructuredOutput(DecisionSchema, { name: 'DecisionAnalysis' })
    .withRetry({ stopAfterAttempt: 3 });

  try {
    const result = await llm.invoke([
      new SystemMessage(DECISION_PROMPT),
      new HumanMessage(context)
    ]);
    return { decision: result, stepCount: 1 };
  } catch (error) {
    // Heuristic BUY/HOLD/SELL from combined signals
    const healthScore = state.analysis_financial?.financial_health_score || 5;
    const sentiment = state.analysis_news?.sentiment || 'NEUTRAL';
    const riskLevel = state.analysis_risk?.overall_risk_level || 'MEDIUM';

    let score = healthScore; // 1-10 base
    if (sentiment === 'POSITIVE') score += 1.5;
    if (sentiment === 'NEGATIVE') score -= 1.5;
    if (riskLevel === 'LOW') score += 1;
    if (riskLevel === 'HIGH') score -= 1;

    const recommendation = score >= 7.5 ? 'BUY' : score <= 4.5 ? 'SELL' : 'HOLD';
    const confidence = Math.abs(score - 6) > 2 ? 'HIGH' : Math.abs(score - 6) > 1 ? 'MEDIUM' : 'LOW';

    return { 
      decision: { 
        recommendation, 
        confidence, 
        justification: `Decision derived from financial score (${healthScore}/10), ${sentiment.toLowerCase()} news sentiment, and ${riskLevel.toLowerCase()} risk level.`
      }, 
      stepCount: 1 
    };
  }
};
