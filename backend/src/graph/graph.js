import { StateGraph, START, END } from '@langchain/langgraph';
import { AgentState } from './state.js';
import { executePlannerAgent } from '../agents/plannerAgent.js';
import { executeResearchAgent } from '../agents/researchAgent.js';
import { executeFinancialAgent } from '../agents/financialAgent.js';
import { executeNewsAgent } from '../agents/newsAgent.js';
import { executeRiskAgent } from '../agents/riskAgent.js';
import { executeDecisionAgent } from '../agents/decisionAgent.js';
import { executeSynthesizerAgent } from '../agents/synthesizerAgent.js';

/**
 * Builds and compiles the LangGraph State Machine.
 */
export const buildResearchGraph = () => {
  const workflow = new StateGraph(AgentState)
    .addNode('planner_node', executePlannerAgent)
    .addNode('research_node', executeResearchAgent)
    .addNode('financial_node', executeFinancialAgent)
    .addNode('news_node', executeNewsAgent)
    .addNode('risk_node', executeRiskAgent)
    .addNode('decision_node', executeDecisionAgent)
    .addNode('synthesizer_node', executeSynthesizerAgent);

  // Edges
  workflow.addEdge(START, 'planner_node');

  // Conditional routing after planner
  workflow.addConditionalEdges('planner_node', (state) => {
    return state.is_valid ? 'valid' : 'invalid';
  }, {
    valid: 'research_node',
    invalid: 'synthesizer_node' // Skip to output error
  });

  // Parallel Execution: Financial and News happen after Research
  workflow.addEdge('research_node', 'financial_node');
  workflow.addEdge('research_node', 'news_node');

  // Risk assesses both financial and news
  workflow.addEdge('financial_node', 'risk_node');
  workflow.addEdge('news_node', 'risk_node');

  workflow.addEdge('risk_node', 'decision_node');
  workflow.addEdge('decision_node', 'synthesizer_node');
  workflow.addEdge('synthesizer_node', END);

  return workflow.compile();
};
