import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Clock, Heart, ExternalLink, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWatchlistStore } from '../store/uiStore';

const API_BASE = 'http://localhost:8000/api/v1/research';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isWatched, toggle } = useWatchlistStore();

  useEffect(() => {
    axios.get(`${API_BASE}/history`)
      .then(res => setHistory(res.data.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const recColor = {
    BUY: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    HOLD: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    SELL: 'text-red-400 bg-red-500/10 border-red-500/30',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-black">Research History</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No reports yet</p>
            <p className="text-sm mt-1">Search for a company to generate your first report</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors">
              Start Research <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {history.map((item, i) => (
                <motion.div
                  key={item._id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all group"
                >
                  {/* Ticker */}
                  <div className="w-14 h-14 rounded-xl bg-black border border-zinc-800 flex items-center justify-center font-black text-lg text-white shrink-0 group-hover:border-emerald-500/30 transition-colors">
                    {item.ticker?.slice(0, 4)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-lg">{item.ticker}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${recColor[item.recommendation] || recColor.HOLD}`}>
                        {item.recommendation}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggle(item.ticker)}
                      className={`p-2 rounded-xl transition-colors ${isWatched(item.ticker) ? 'text-red-400 bg-red-500/10' : 'text-zinc-600 hover:text-red-400 hover:bg-red-500/10'}`}
                    >
                      <Heart className={`w-4 h-4 ${isWatched(item.ticker) ? 'fill-current' : ''}`} />
                    </button>
                    <Link
                      to={`/report/${item.sessionId}`}
                      state={{ fromHistory: true, report: item }}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-xl transition-colors"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HistoryPage;
