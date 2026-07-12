import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Plus, X, TrendingUp, TrendingDown, Minus, Trophy, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1/research';

const POPULAR = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META'];

const MetricRow = ({ label, values, unit = '', higher = true }) => {
  const nums = values.map(v => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0);
  const max = Math.max(...nums);
  const min = Math.min(...nums);

  return (
    <tr className="border-b border-zinc-800/50">
      <td className="py-3 px-4 text-sm text-zinc-400 font-medium">{label}</td>
      {values.map((v, i) => {
        const num = nums[i];
        const isBest = higher ? num === max && max > 0 : num === min && min > 0;
        return (
          <td key={i} className={`py-3 px-4 text-sm text-center font-semibold ${isBest ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {v || 'N/A'} {isBest && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded ml-1">BEST</span>}
          </td>
        );
      })}
    </tr>
  );
};

const ComparisonPage = () => {
  const [tickers, setTickers] = useState(['AAPL', 'MSFT']);
  const [input, setInput] = useState('');
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addTicker = (t) => {
    const ticker = t.toUpperCase().trim();
    if (!ticker || tickers.includes(ticker) || tickers.length >= 4) return;
    setTickers(prev => [...prev, ticker]);
    setInput('');
  };

  const removeTicker = (t) => setTickers(prev => prev.filter(x => x !== t));

  const runComparison = async () => {
    setLoading(true);
    setError('');
    const results = {};
    
    await Promise.all(tickers.map(async (ticker) => {
      try {
        // Start session
        const startRes = await axios.post(API_BASE, { ticker });
        const sessionId = startRes.data.data.session_id;
        
        // Stream and collect events
        await new Promise((resolve) => {
          const sse = new EventSource(`${API_BASE}/${sessionId}/stream?ticker=${ticker}`);
          sse.onmessage = (e) => {
            try {
              const event = JSON.parse(e.data);
              if (event.type === 'session.completed') {
                results[ticker] = event.payload.report;
                sse.close();
                resolve();
              }
              if (event.type === 'session.error') { sse.close(); resolve(); }
            } catch {}
          };
          sse.onerror = () => { sse.close(); resolve(); };
          setTimeout(() => { sse.close(); resolve(); }, 60000);
        });
      } catch {}
    }));

    setReports(results);
    setLoading(false);
  };

  const recColor = { BUY: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', HOLD: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30', SELL: 'text-red-400 bg-red-500/20 border-red-500/30' };
  
  const hasReports = Object.keys(reports).length > 0;
  const winner = hasReports && Object.entries(reports).sort((a, b) => (b[1]?.investment_score || 0) - (a[1]?.investment_score || 0))[0];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <GitCompare className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-black">Company Comparison</h1>
        </div>

        {/* Ticker selector */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <p className="text-sm text-zinc-400 mb-4">Add up to 4 companies to compare side-by-side</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tickers.map(t => (
              <div key={t} className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-xl font-bold">
                <span>{t}</span>
                <button onClick={() => removeTicker(t)} className="text-zinc-500 hover:text-red-400"><X className="w-3 h-3" /></button>
              </div>
            ))}
            {tickers.length < 4 && (
              <form onSubmit={(e) => { e.preventDefault(); addTicker(input); }} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value.toUpperCase())}
                  placeholder="Add ticker..."
                  maxLength={5}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm w-28 focus:outline-none focus:border-emerald-500/50 uppercase font-bold"
                />
                <button type="submit" className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700"><Plus className="w-4 h-4" /></button>
              </form>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {POPULAR.filter(t => !tickers.includes(t)).map(t => (
              <button key={t} onClick={() => addTicker(t)} className="px-3 py-1 text-xs text-zinc-400 border border-zinc-800 hover:border-emerald-500/40 hover:text-emerald-400 rounded-full transition-colors">
                + {t}
              </button>
            ))}
          </div>

          <button
            onClick={runComparison}
            disabled={loading || tickers.length < 2}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing... (this may take ~30s)</> : <><GitCompare className="w-4 h-4" /> Compare Companies</>}
          </button>
        </div>

        {/* Results */}
        {hasReports && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Winner Banner */}
            {winner && winner[1]?.investment_score > 0 && (
              <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-4">
                <Trophy className="w-10 h-10 text-yellow-400" />
                <div>
                  <p className="text-sm text-emerald-400 font-bold tracking-widest uppercase">AI Recommendation Winner</p>
                  <p className="text-3xl font-black text-white mt-1">{winner[0]}</p>
                  <p className="text-zinc-400 text-sm mt-1">Investment Score: {winner[1].investment_score}/100</p>
                </div>
              </div>
            )}

            {/* Header row */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black/30">
                    <th className="py-4 px-4 text-left text-sm text-zinc-500 font-medium">Metric</th>
                    {tickers.map(t => (
                      <th key={t} className="py-4 px-4 text-center">
                        <div>
                          <div className="font-black text-lg text-white">{t}</div>
                          {reports[t] && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${recColor[reports[t]?.recommendation] || recColor.HOLD}`}>
                              {reports[t]?.recommendation || 'N/A'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <MetricRow label="Investment Score" values={tickers.map(t => reports[t]?.investment_score || 0)} unit="/100" />
                  <MetricRow label="Stock Price" values={tickers.map(t => reports[t]?.financial_highlights?.find(f => f.metric_name === 'Stock Price')?.value || 'N/A')} />
                  <MetricRow label="Market Cap" values={tickers.map(t => reports[t]?.financial_highlights?.find(f => f.metric_name === 'Market Cap')?.value || 'N/A')} />
                  <MetricRow label="Revenue" values={tickers.map(t => reports[t]?.financial_highlights?.find(f => f.metric_name === 'Revenue')?.value || 'N/A')} />
                  <MetricRow label="Gross Margin" values={tickers.map(t => reports[t]?.financial_highlights?.find(f => f.metric_name === 'Gross Margin')?.value || 'N/A')} />
                  <MetricRow label="P/E Ratio" values={tickers.map(t => reports[t]?.financial_highlights?.find(f => f.metric_name === 'P/E Ratio')?.value || 'N/A')} higher={false} />
                  <MetricRow label="Confidence" values={tickers.map(t => reports[t]?.confidence_level || 'N/A')} />
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ComparisonPage;
