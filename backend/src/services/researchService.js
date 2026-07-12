import InvestmentReport from '../models/InvestmentReport.js';
import SearchHistory from '../models/SearchHistory.js';
import { buildResearchGraph } from '../graph/graph.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

export const createResearchSession = async (ticker, query) => {
  const sessionId = new mongoose.Types.ObjectId();
  
  try {
    await SearchHistory.create({ ticker, query });
  } catch (e) {
    logger.warn({ error: e.message }, 'SearchHistory create failed (non-fatal)');
  }

  return sessionId.toString();
};

export const runGraphAndStream = async (sessionId, ticker, res) => {
  const graph = buildResearchGraph();
  const initialState = { sessionId, ticker: ticker.toUpperCase(), query: '' };

  const nodeLabels = {
    'planner_node': 'Searching Yahoo Finance',
    'research_node': 'Reading NewsAPI',
    'financial_node': 'Running financial analysis',
    'news_node': 'Evaluating market sentiment',
    'risk_node': 'Calculating confidence',
    'decision_node': 'Comparing competitors',
    'synthesizer_node': 'Preparing recommendation'
  };

  let finalState = null;

  try {
    // ✅ FIX: Use streamEvents to BOTH stream events AND capture the final state.
    // This avoids the costly double graph.invoke() call.
    const stream = graph.streamEvents(initialState, { version: 'v2' });

    for await (const event of stream) {
      // Emit timeline progress when a node starts
      if (event.event === 'on_chain_start' && nodeLabels[event.name]) {
        res.write(`data: ${JSON.stringify({ type: 'tool.calling', payload: { tool: nodeLabels[event.name] } })}\n\n`);
      }

      // Emit partial data as soon as each node completes (streaming sections to the UI)
      if (event.event === 'on_chain_end' && nodeLabels[event.name]) {
        const output = event.data?.output;
        if (output && Object.keys(output).length > 0) {
          res.write(`data: ${JSON.stringify({ type: 'tool.result', payload: { data: output } })}\n\n`);
        }
        // Capture the final state from the synthesizer node
        if (event.name === 'synthesizer_node' && output) {
          finalState = output;
        }
        // Also capture from LangGraph's built-in final state tracking
        if (event.name === '__end__' && event.data?.output) {
          finalState = { ...finalState, ...event.data.output };
        }
      }
    }

    // Extract the final report from the aggregated state
    const report = finalState?.finalReport;

    if (report) {
      try {
        await InvestmentReport.findOneAndUpdate(
          { sessionId },
          { 
            sessionId, ticker: ticker.toUpperCase(),
            recommendation: report.recommendation || 'HOLD',
            confidence: report.confidence_level || 'LOW',
            content: report
          },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        logger.warn({ error: dbErr.message }, 'Failed to save report to DB (non-fatal)');
      }
      res.write(`data: ${JSON.stringify({ type: 'session.completed', payload: { report } })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'session.error', payload: { error: 'Research completed but report generation failed. Please try again.' } })}\n\n`);
    }

    res.end();

  } catch (error) {
    logger.error({ error: error.message, stack: error.stack }, 'Graph execution failed');
    res.write(`data: ${JSON.stringify({ type: 'session.error', payload: { error: `Research failed: ${error.message}` } })}\n\n`);
    res.end();
  }
};

export const getReportHistory = async () => {
  return InvestmentReport.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .select('sessionId ticker recommendation confidence createdAt')
    .lean();
};

export const getReportBySessionId = async (sessionId) => {
  return InvestmentReport.findOne({ sessionId }).lean();
};
