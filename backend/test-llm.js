import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';
dotenv.config();

const PlannerSchema = z.object({
  ticker: z.string().describe('The extracted stock ticker, max 5 uppercase letters'),
  is_valid: z.boolean().describe('True if the ticker is valid, false otherwise'),
  focus_areas: z.array(z.string()).describe('Specific areas the user wants researched'),
  error_message: z.string().nullable().describe('Error message if invalid or rejected')
});

async function run() {
  try {
    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: 'gemini-1.5-pro',
      temperature: 0,
    });

    const structuredLlm = llm
      .withStructuredOutput(PlannerSchema, { name: 'PlannerResult' })
      .withRetry({ stopAfterAttempt: 3 });

    const result = await structuredLlm.invoke([
      new SystemMessage("You are a planner."),
      new HumanMessage("Research AAPL")
    ]);

    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
  }
}

run();
