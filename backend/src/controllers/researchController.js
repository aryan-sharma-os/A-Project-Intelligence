import { createResearchSession, runGraphAndStream, getReportHistory as fetchHistory, getReportBySessionId } from '../services/researchService.js';
import { streamChatResponse } from '../services/chatService.js';
import InvestmentReport from '../models/InvestmentReport.js';

export const startResearch = async (req, res) => {
  const { ticker, query } = req.body;
  const sessionId = await createResearchSession(ticker, query);
  
  res.status(202).json({
    status: 'success',
    data: { session_id: sessionId }
  });
};

export const streamResearch = async (req, res) => {
  const { id } = req.params;
  const { ticker } = req.query;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  await runGraphAndStream(id, ticker || 'AAPL', res);
};

export const getReport = async (req, res) => {
  const report = await InvestmentReport.findOne({ sessionId: req.params.id });
  if (!report) {
    return res.status(404).json({ status: 'error', error: { message: 'Report not found' } });
  }
  res.status(200).json({ status: 'success', data: report });
};

export const getReportHistory = async (req, res) => {
  try {
    const history = await fetchHistory();
    res.status(200).json({ status: 'success', data: history });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { message: error.message } });
  }
};

export const chatWithReport = async (req, res) => {
  const { id } = req.params;
  const { messages } = req.body;

  const reportDoc = await getReportBySessionId(id);
  if (!reportDoc) {
    return res.status(404).json({ status: 'error', error: { message: 'Report not found for chat' } });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  await streamChatResponse(reportDoc.content, messages || [], res);
};
