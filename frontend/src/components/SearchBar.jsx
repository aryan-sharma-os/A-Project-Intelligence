import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowRight, Loader2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResearchStore } from '../store/researchStore';

const POPULAR_TICKERS = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'AMD'];
const ALL_SUGGESTIONS = [
  { ticker: 'AAPL',  name: 'Apple Inc.' },
  { ticker: 'MSFT',  name: 'Microsoft Corporation' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'GOOG',  name: 'Alphabet Inc. (Class C)' },
  { ticker: 'AMZN',  name: 'Amazon.com, Inc.' },
  { ticker: 'NVDA',  name: 'NVIDIA Corporation' },
  { ticker: 'TSLA',  name: 'Tesla, Inc.' },
  { ticker: 'META',  name: 'Meta Platforms, Inc.' },
  { ticker: 'NFLX',  name: 'Netflix, Inc.' },
  { ticker: 'JPM',   name: 'JPMorgan Chase & Co.' },
  { ticker: 'V',     name: 'Visa Inc.' },
  { ticker: 'AMD',   name: 'Advanced Micro Devices, Inc.' },
  { ticker: 'INTC',  name: 'Intel Corporation' },
  { ticker: 'PYPL',  name: 'PayPal Holdings, Inc.' },
  { ticker: 'UBER',  name: 'Uber Technologies, Inc.' },
  { ticker: 'SHOP',  name: 'Shopify Inc.' },
  { ticker: 'DIS',   name: 'The Walt Disney Company' },
  { ticker: 'ORCL',  name: 'Oracle Corporation' },
  { ticker: 'CRM',   name: 'Salesforce, Inc.' },
  { ticker: 'BABA',  name: 'Alibaba Group Holding Limited' },
  { ticker: 'COIN',  name: 'Coinbase Global, Inc.' },
  { ticker: 'SPOT',  name: 'Spotify Technology S.A.' },
  { ticker: 'BA',    name: 'The Boeing Company' },
  { ticker: 'GS',    name: 'The Goldman Sachs Group, Inc.' },
];

const SearchBar = ({ large = false }) => {
  const [ticker, setTicker] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { startSession, status, error } = useResearchStore();
  const inputRef = useRef(null);
  const location = useLocation();

  // Pre-fill from state if navigated from watchlist
  useEffect(() => {
    if (location.state?.ticker) {
      setTicker(location.state.ticker);
      inputRef.current?.focus();
    }
  }, [location.state]);

  const filteredSuggestions = ticker.length >= 1
    ? ALL_SUGGESTIONS.filter(s =>
        s.ticker.startsWith(ticker.toUpperCase()) || s.name.toLowerCase().includes(ticker.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSubmit = async (tickerValue) => {
    const t = (tickerValue || ticker).trim().toUpperCase();
    if (!t) return;
    setShowSuggestions(false);
    setTicker(t);
    try {
      const sessionId = await startSession(t);
      navigate(`/report/${sessionId}`);
    } catch (err) {
      console.error('Failed to start session', err);
    }
  };

  const isStarting = status === 'STARTING';

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative group">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl group-hover:bg-emerald-500/30 transition-all duration-500 opacity-50" />
        <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl overflow-visible focus-within:border-emerald-500/50 transition-colors">
          <Search className="w-5 h-5 text-zinc-500 ml-3 shrink-0" />
          <input
            id="main-search-input"
            ref={inputRef}
            type="text"
            placeholder="Search ticker (AAPL, TSLA…) or press /"
            className="flex-1 bg-transparent border-none outline-none text-lg px-4 py-2.5 text-white placeholder:text-zinc-600 uppercase font-bold"
            value={ticker}
            onChange={(e) => { setTicker(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            disabled={isStarting}
            maxLength={10}
            autoComplete="off"
          />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={!ticker.trim() || isStarting}
            type="submit"
            className="bg-white text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm"
          >
            {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><TrendingUp className="w-4 h-4" />Analyze</>}
          </motion.button>
        </div>

        {/* Autocomplete dropdown */}
        <AnimatePresence>
          {showSuggestions && ticker.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {filteredSuggestions.map(s => (
                <button
                  key={s.ticker}
                  type="button"
                  onMouseDown={() => handleSubmit(s.ticker)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 text-left transition-colors"
                >
                  <span className="font-black text-white w-14">{s.ticker}</span>
                  <span className="text-sm text-zinc-400">{s.name}</span>
                </button>
              ))}
              {filteredSuggestions.length === 0 && ticker.length > 0 && (
                <button
                  type="button"
                  onMouseDown={() => handleSubmit(ticker)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 text-left transition-colors"
                >
                  <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm text-white">Search for ticker <strong className="text-emerald-400">{ticker.toUpperCase()}</strong></span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {error && (
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-3 bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20">
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default SearchBar;
