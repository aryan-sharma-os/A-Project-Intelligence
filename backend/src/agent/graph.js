import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from './state.js';
import {
  inputValidator,
  researchPlanner,
  dataGatherer,
  riskAssessor,
  reportSynthesizer,
  qualityReviewer
} from './nodes/index.js';

const routeAfterValidation = (state) => {
  if (state.errors.length > 0) return END;
  return 'planner';
};

const routeAfterReview = (state) => {
  if (state.stepCount > 15) return END;
  if (state.isComplete) return END;
  return 'synthesizer';
};

export const buildResearchGraph = () => {
  const workflow = new StateGraph(AgentState)
    .addNode('validator', inputValidator)
    .addNode('planner', researchPlanner)
    .addNode('gatherer', dataGatherer)
    .addNode('assessor', riskAssessor)
    .addNode('synthesizer', reportSynthesizer)
    .addNode('reviewer', qualityReviewer)
    
    .addEdge('__start__', 'validator')
    .addConditionalEdges('validator', routeAfterValidation, {
      planner: 'planner',
      [END]: END
    })
    .addEdge('planner', 'gatherer')
    .addEdge('gatherer', 'assessor')
    .addEdge('assessor', 'synthesizer')
    .addEdge('synthesizer', 'reviewer')
    .addConditionalEdges('reviewer', routeAfterReview, {
      synthesizer: 'synthesizer',
      [END]: END
    });

  return workflow.compile();
};
