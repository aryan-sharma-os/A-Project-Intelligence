import { Annotation } from '@langchain/langgraph';

// Custom reducer to append arrays instead of overwriting
const appendReducer = (a, b) => (a || []).concat(b || []);

const defaultReducer = (state, update) => update ?? state;

export const AgentState = Annotation.Root({
  sessionId: Annotation({ reducer: defaultReducer, default: () => '' }),
  ticker: Annotation({ reducer: defaultReducer, default: () => '' }),
  query: Annotation({ reducer: defaultReducer, default: () => '' }),
  is_valid: Annotation({ reducer: defaultReducer, default: () => true }),
  
  // Raw Data
  financialData: Annotation({ reducer: defaultReducer, default: () => null }),
  newsData: Annotation({ reducer: defaultReducer, default: () => null }),
  
  // Analysis
  analysis_financial: Annotation({ reducer: defaultReducer, default: () => null }),
  analysis_news: Annotation({ reducer: defaultReducer, default: () => null }),
  analysis_risk: Annotation({ reducer: defaultReducer, default: () => null }),
  decision: Annotation({ reducer: defaultReducer, default: () => null }),
  
  // Output
  finalReport: Annotation({ reducer: defaultReducer, default: () => null }),
  errors: Annotation({ reducer: appendReducer, default: () => [] }),
  stepCount: Annotation({ reducer: (x, y) => x + y, default: () => 0 })
});
