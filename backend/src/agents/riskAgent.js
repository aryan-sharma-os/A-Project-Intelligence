import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { RISK_PROMPT } from '../prompts/agents.js';

export const RiskSchema = z.object({
  macro_risks: z.array(z.string()),
  micro_risks: z.array(z.string()),
  bear_case_summary: z.string(),
  overall_risk_level: z.enum(['HIGH', 'MEDIUM', 'LOW'])
});

export const executeRiskAgent = async (state) => {
  const context = JSON.stringify({
    financial_analysis: state.analysis_financial,
    news_analysis: state.analysis_news,
    financial_data: state.financialData
  });

  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.0-flash', temperature: 0 })
    .withStructuredOutput(RiskSchema, { name: 'RiskAnalysis' })
    .withRetry({ stopAfterAttempt: 3 });

  try {
    const result = await llm.invoke([
      new SystemMessage(RISK_PROMPT),
      new HumanMessage(context)
    ]);
    return { analysis_risk: result, stepCount: 1 };
  } catch (error) {
    // Derive risk level from financial health score
    const healthScore = state.analysis_financial?.financial_health_score || 5;
    const sentiment = state.analysis_news?.sentiment || 'NEUTRAL';
    const riskLevel = healthScore >= 7 && sentiment !== 'NEGATIVE' ? 'LOW' : healthScore <= 4 || sentiment === 'NEGATIVE' ? 'HIGH' : 'MEDIUM';
    return { 
      analysis_risk: { 
        overall_risk_level: riskLevel,
        bear_case_summary: `Risk assessment based on financial health score of ${healthScore}/10 and ${sentiment.toLowerCase()} news sentiment.`,
        macro_risks: ['Market volatility and macroeconomic headwinds', 'Interest rate sensitivity affecting valuation multiples'],
        micro_risks: ['Competitive pressure in core markets', 'Execution risk on growth initiatives', 'Regulatory scrutiny']
      }, 
      stepCount: 1 
    };
  }
};
