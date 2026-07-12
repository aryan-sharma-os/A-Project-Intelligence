import { buildResearchGraph } from './src/graph/graph.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const graph = buildResearchGraph();
  const sessionId = new mongoose.Types.ObjectId().toString();
  const initialState = { sessionId, ticker: 'AAPL', query: '' };
  
  try {
    console.log("Invoking graph with:", initialState);
    const finalState = await graph.invoke(initialState);
    console.log("Final State:", JSON.stringify(finalState, null, 2));
  } catch (error) {
    console.error("Graph Error:", error);
  }
}

run();
