import { getFinancialStatements } from '../tools/yahooFinance.js';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SYNTHESIS_SYSTEM_PROMPT } from '../prompts/synthesizer.js';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// Zod Schema for strict structured output
const ReportSchema = z.object({
  executive_summary: z.string(),
  company_overview: z.string(),
  financial_highlights: z.array(z.object({
    metric_name: z.string(),
    value: z.string(),
    context: z.string()
  })),
  risks: z.array(z.object({
    risk_type: z.string(),
    description: z.string(),
    severity: z.enum(['High', 'Medium', 'Low'])
  })),
  bull_case: z.array(z.string()),
  bear_case: z.array(z.string()),
  recommendation: z.enum(['BUY', 'HOLD', 'SELL']),
  confidence_level: z.enum(['HIGH', 'MEDIUM', 'LOW'])
});

export const inputValidator = async (state) => {
  return { stepCount: 1 };
};

export const researchPlanner = async (state) => {
  return { researchPlan: 'Plan generated', stepCount: 1 };
};

export const dataGatherer = async (state) => {
  const financials = await getFinancialStatements(state.ticker);
  return {
    financialStatements: financials.status === 'success' ? financials.data : null,
    stepCount: 1
  };
};

export const riskAssessor = async (state) => {
  return { riskAssessment: 'Risk evaluated', stepCount: 1 };
};

export const reportSynthesizer = async (state) => {
  const llm = new ChatGoogleGenerativeAI({ modelName: 'gemini-2.5-pro', temperature: 0.2 });
  const structuredLlm = llm.withStructuredOutput(ReportSchema, { name: 'ResearchReport' });


  const dataContext = JSON.stringify({
    financials: state.financialStatements,
    risk: state.riskAssessment
  });

  const sysPrompt = SYNTHESIS_SYSTEM_PROMPT.replace('{ticker}', state.ticker).replace('{data_context}', dataContext);
  
  try {
    const report = await structuredLlm.invoke([
      new SystemMessage(sysPrompt),
      new HumanMessage(`Generate the research report for ${state.ticker}`)
    ]);
    return { finalReport: report, stepCount: 1 };
  } catch (err) {
    console.error('Synthesis failed:', err);
    return { errors: [err.message], stepCount: 1 };
  }
};

export const qualityReviewer = async (state) => {
  if (state.finalReport) {
    return { isComplete: true, stepCount: 1 };
  }
  return { isComplete: false, stepCount: 1 };
};
