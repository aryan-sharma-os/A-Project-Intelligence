import { Annotation } from '@langchain/langgraph';

// Define the state schema using LangGraph Annotation
export const AgentState = Annotation.Root({
  sessionId: Annotation.String,
  ticker: Annotation.String,
  query: Annotation.String,
  
  stepCount: Annotation({
    reducer: (x, y) => x + y,
    default: () => 0,
  }),
  
  errors: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  
  companyProfile: Annotation.Any,
  stockPriceData: Annotation.Any,
  financialStatements: Annotation.Any,
  newsData: Annotation.Any,
  peerData: Annotation.Any,
  
  researchPlan: Annotation.String,
  riskAssessment: Annotation.String,
  
  finalReport: Annotation.Any,
  isComplete: Annotation.Boolean,
});
