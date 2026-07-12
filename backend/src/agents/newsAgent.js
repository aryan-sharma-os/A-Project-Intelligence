import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { NEWS_PROMPT } from '../prompts/agents.js';

export const NewsSchema = z.object({
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
  major_events: z.array(z.string()),
  sentiment_summary: z.string()
});

export const executeNewsAgent = async (state) => {
  if (!state.newsData || state.newsData.length === 0) {
    return { analysis_news: { sentiment: 'NEUTRAL', sentiment_summary: "No recent news data was available for analysis.", major_events: [] }, stepCount: 1 };
  }

  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.0-flash', temperature: 0 })
    .withStructuredOutput(NewsSchema, { name: 'NewsAnalysis' })
    .withRetry({ stopAfterAttempt: 3 });

  try {
    const result = await llm.invoke([
      new SystemMessage(NEWS_PROMPT),
      new HumanMessage(JSON.stringify(state.newsData.slice(0, 6)))
    ]);
    return { analysis_news: result, stepCount: 1 };
  } catch (error) {
    // Heuristic sentiment from news titles
    const titles = state.newsData.map(n => n.title.toLowerCase()).join(' ');
    const positiveWords = (titles.match(/growth|surge|beat|record|strong|upgrade|launch|profit|gain/g) || []).length;
    const negativeWords = (titles.match(/fall|drop|loss|risk|decline|lawsuit|fine|miss|cut|warn/g) || []).length;
    const sentiment = positiveWords > negativeWords ? 'POSITIVE' : negativeWords > positiveWords ? 'NEGATIVE' : 'NEUTRAL';
    return { 
      analysis_news: { 
        sentiment, 
        sentiment_summary: `News analysis based on ${state.newsData.length} recent headlines. Detected ${positiveWords} positive and ${negativeWords} negative signals.`,
        major_events: state.newsData.slice(0, 3).map(n => n.title)
      }, 
      stepCount: 1 
    };
  }
};
