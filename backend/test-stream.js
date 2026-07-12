import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const schema = z.object({
  executive_summary: z.string(),
  financials: z.string(),
  recommendation: z.string()
});

async function testStream() {
  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.5-flash', temperature: 0 })
    .withStructuredOutput(schema, { name: 'Report' });

  try {
    const stream = await llm.stream("Write a 50 word executive summary, 50 word financials, and recommendation for Apple.");
    for await (const chunk of stream) {
      console.log("CHUNK:", chunk);
    }
  } catch (e) {
    console.error(e);
  }
}
testStream();
