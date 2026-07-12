import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, BarChart3, Search, ChevronRight, Activity } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useResearchStore } from '../store/researchStore';

const POPULAR = [
  { ticker: 'AAPL', name: 'Apple' },
  { ticker: 'NVDA', name: 'NVIDIA' },
  { ticker: 'MSFT', name: 'Microsoft' },
  { ticker: 'META', name: 'Meta' },
  { ticker: 'AMZN', name: 'Amazon' },
];

const TICKER_TAPE = [
  { symbol: 'SPY', price: '512.30', change: '+1.2%' },
  { symbol: 'QQQ', price: '438.15', change: '+1.5%' },
  { symbol: 'BTC', price: '64,230', change: '+2.1%' },
  { symbol: 'ETH', price: '3,450', change: '+0.8%' },
  { symbol: 'TSLA', price: '181.73', change: '-0.4%' },
  { symbol: 'GOOGL', price: '172.21', change: '-0.2%' },
];

const Home = () => {
  const navigate = useNavigate();
  const { startSession } = useResearchStore();

  const handleQuickSearch = async (ticker) => {
    try {
      const sessionId = await startSession(ticker);
      navigate(`/report/${sessionId}`);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans overflow-x-hidden relative">
      
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Ticker Tape (Infinite Scroll) */}
      <div className="w-full bg-zinc-900/40 border-b border-zinc-800/50 backdrop-blur-md overflow-hidden py-2 flex items-center">
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          className="flex whitespace-nowrap gap-8 pr-8"
        >
          {[...TICKER_TAPE, ...TICKER_TAPE].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium">
              <span className="text-white">{item.symbol}</span>
              <span className="text-zinc-400">{item.price}</span>
              <span className={item.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>{item.change}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mx-auto text-center relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>A-Project Intelligence</span>
          </motion.div>

          {/* Hero Headline */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            AI Investment Research. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Perfected.
            </span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Generate institutional-grade investment reports in seconds. Real-time data, deep financial modeling, and 7 autonomous agents working for you.
          </p>

          {/* Search Area */}
          <div className="max-w-3xl mx-auto mb-12 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <SearchBar />
            </div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 text-sm"
          >
            <span className="text-zinc-500 font-medium">Trending Analysis:</span>
            {POPULAR.map(({ ticker, name }, i) => (
              <button
                key={ticker}
                onClick={() => handleQuickSearch(ticker)}
                className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-zinc-300 hover:text-emerald-400 transition-all font-medium flex items-center gap-1"
              >
                {ticker} <span className="text-[10px] text-zinc-500 hidden sm:inline ml-1">{name}</span>
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, title: "Real-time Metrics", desc: "Live market data, financials, and pricing." },
            { icon: Zap, title: "7 Agent System", desc: "Specialized AI agents cross-checking each other." },
            { icon: Shield, title: "Risk Modeling", desc: "Deep analysis of macro and micro risk factors." },
            { icon: BarChart3, title: "Interactive UI", desc: "Beautiful charts and structured data views." }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl hover:bg-zinc-800/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-colors">
                <feat.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
