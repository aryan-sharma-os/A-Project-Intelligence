import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';
dotenv.config();

const models = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-pro',
  'gemini-pro',
  'gemini-1.0-pro'
];

async function testModels() {
  for (const model of models) {
    try {
      const llm = new ChatGoogleGenerativeAI({
        model: model,
        temperature: 0,
        maxRetries: 0
      });
      console.log(`Testing ${model}...`);
      const res = await llm.invoke([new HumanMessage("Hello")]);
      console.log(`SUCCESS: ${model}`);
    } catch (e) {
      console.error(`FAILED: ${model} - ${e.message}`);
    }
  }
}

testModels();
