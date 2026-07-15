# A-Project Intelligence

**Live Demo:** [https://a-project-intelligence.vercel.app/](https://a-project-intelligence.vercel.app/)

## Overview — What it does
A-Project Intelligence is a premium, AI-first financial research platform. It leverages advanced Large Language Models (LLMs) and a customized multi-agent architecture (using LangGraph/LangChain) to perform deep, institutional-grade equity research in real-time. 

Users can search for any publicly traded company by ticker symbol. The platform autonomously gathers live financial data, aggregates recent news via RSS feeds, and synthesizes a comprehensive research report. The report includes an executive summary, financial performance charts, risk assessments, competitor analysis, and an investment thesis. Additionally, the platform features an interactive AI Analyst Chat that allows users to ask follow-up questions directly grounded in the generated report.

## How to run it — Setup and run steps

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas URI)
- Google Gemini API Key

### Environment Variables
1. Create a `.env` file in the `backend` directory with the following:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```
2. (Optional) Create a `.env` file in the `frontend` directory if you plan to change the API URL:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Running the Application Locally
1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev  # or `node index.js` if dev script is not set
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
The frontend will run on `http://localhost:5173` and the backend will run on `http://localhost:8000`.

## How it works — Your approach and architecture
The architecture is divided into a robust Express/Node.js backend and a modern React/Vite frontend.

**Frontend Architecture:**
Built with React, TailwindCSS, and Framer Motion for a premium, dynamic UI. It uses Zustand for global state management (Authentication and Research Data). Recharts is utilized for rendering financial performance trends. We utilized Server-Sent Events (SSE) to stream the AI's thought process (tool execution) and the final report in real-time, creating a highly interactive user experience.

**Backend & AI Architecture:**
Built on Node.js, Express, and MongoDB. The core AI engine uses `@langchain/google-genai` and `@langchain/langgraph`. 
When a research request is made, a `Research Session` is initialized in MongoDB. The backend spawns an autonomous agent pipeline:
1. **Data Collection:** Fetches live price data, market cap, and historical financial data (simulated via Yahoo Finance / standard APIs).
2. **News Aggregation:** Parses RSS feeds to gather the latest market sentiment.
3. **Synthesizer Agent:** An LLM processes the raw data, applies financial heuristics, and outputs a highly structured JSON report.
4. **AI Chat Service:** A separate LLM context is loaded with the finalized report, allowing the user to chat with the data via SSE streaming.

## Key decisions & trade-offs
- **Server-Sent Events (SSE) vs WebSockets:** Chose SSE for streaming the agent's real-time progress and chat responses because it is unidirectional (server-to-client) and significantly simpler to scale and implement than full-duplex WebSockets.
- **MongoDB for Storage:** Selected MongoDB due to the highly nested, schema-less nature of the generated JSON research reports. It allows us to easily store the entire report object without complex relational mapping.
- **Native Print for PDF Export:** Initially experimented with `html2pdf.js` for exporting reports to PDF, but it struggled with complex SVG gradients in Recharts. Traded it for a robust `@media print` CSS strategy utilizing the browser's native `window.print()`, guaranteeing flawless vector rendering and dark-mode preservation.
- **Heuristic Fallbacks:** Implemented heuristic fallback mechanisms in both the Synthesizer Agent and the Chat Service. If the LLM rate limit is hit (a common issue with free-tier APIs), the system gracefully degrades by analyzing the quantitative data locally and providing a generated response, ensuring the UI never breaks.

## Example runs
- **AAPL (Apple Inc.):** Successfully aggregated data showing its massive $383B revenue and heavy reliance on the iPhone ecosystem. The AI correctly identified its main competitors (MSFT, GOOGL) and provided a "BUY" recommendation based on its strong free cash flow and AI integration (Apple Intelligence) roadmap.
- **TSLA (Tesla Inc.):** Generated a report highlighting the severe risks regarding margins and EV market competition, offset by the bull case of FSD (Full Self-Driving) advancements.
- **JPM (JPMorgan Chase & Co.):** Pulled live financial data, correctly assessing its dominant position in banking and generating an investment score grounded in its stable dividend yield.

## What you would improve with more time
- **Real-time Financial API Integration:** Replace simulated financial data endpoints with premium APIs like Bloomberg, Alpha Vantage, or Polygon.io for real-time order book data and SEC filings.
- **Advanced Graph Algorithms:** Enhance the LangGraph implementation to include multiple specialized agents (e.g., a dedicated Risk Analyst Agent, a Sentiment Analyst Agent) that debate with each other before finalizing the report.
- **User Portfolios:** Implement a portfolio tracking system where users can save stocks and the AI proactively alerts them of news affecting their holdings.
- **Responsive Mobile Polish:** While functional on mobile, the heavy data tables and charts could be optimized further for smaller viewports.

## BONUS: LLM Chat Logs
The complete AI chat logs detailing the entire build process, thought process, error resolution, and architectural decisions are included in the `LLM_Logs` folder within this repository.
