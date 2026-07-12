import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

const CHAT_SYSTEM_PROMPT = `You are an expert AI financial analyst assistant. You have access to a detailed investment research report and can answer questions about it.

Be concise, insightful, and data-driven. Reference specific numbers from the report when available. 
If asked to compare with another stock, provide a thoughtful comparison.
If asked about risks, be honest and balanced.
Format your responses with clear headings and bullet points where appropriate.
Always ground your answers in the report data provided.`;

export const streamChatResponse = async (report, messages, res) => {
  const llm = new ChatGoogleGenerativeAI({ 
    model: 'gemini-2.0-flash', 
    temperature: 0.7,
    maxRetries: 2
  });

  const reportContext = `Here is the investment research report you should base your answers on:

**${report.ticker} — ${report.company_name || report.ticker} Investment Report**
- Recommendation: ${report.recommendation}
- Confidence: ${report.confidence_level}
- Investment Score: ${report.investment_score || 'N/A'}/100
- Executive Summary: ${report.executive_summary}

Financial Highlights:
${(report.financial_highlights || []).map(f => `- ${f.metric_name}: ${f.value}`).join('\n')}

Bull Case: ${(report.bull_case || []).join(', ')}
Bear Case: ${(report.bear_case || []).join(', ')}

Risks: ${(report.risks || []).map(r => `${r.risk_type} (${r.severity}): ${r.description}`).join('; ')}

News Sentiment: ${report.news_sentiment || 'Not available'}`;

  const langchainMessages = [
    new SystemMessage(CHAT_SYSTEM_PROMPT),
    new HumanMessage(reportContext),
    new AIMessage('Understood. I have fully analyzed this investment report and am ready to answer your questions about it.'),
    ...messages.map(m => m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content))
  ];

  try {
    const stream = await llm.stream(langchainMessages);
    for await (const chunk of stream) {
      const text = chunk.content;
      if (text) {
        res.write(`data: ${JSON.stringify({ type: 'chat.chunk', payload: { text } })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ type: 'chat.done' })}\n\n`);
    res.end();
  } catch (error) {
    // If rate limit or other error occurs, use a heuristic fallback response
    console.warn('Chat LLM failed, using heuristic fallback:', error.message);
    
    // Simulate streaming the fallback response
    const fallbackMessage = "I'm currently experiencing high demand and rate limits. However, based on the report data, this company has a recommendation of " 
      + report.recommendation 
      + " with an investment score of " 
      + (report.investment_score || 'N/A') 
      + "/100. Please check the 'Key Financials' and 'Risk' tabs for detailed information.";
    
    const words = fallbackMessage.split(' ');
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ type: 'chat.chunk', payload: { text: word + ' ' } })}\n\n`);
      await new Promise(r => setTimeout(r, 50)); // Artificial delay for effect
    }
    
    res.write(`data: ${JSON.stringify({ type: 'chat.done' })}\n\n`);
    res.end();
  }
};
