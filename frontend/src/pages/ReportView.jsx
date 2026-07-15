import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useResearchStore } from '../store/researchStore';
import { useWatchlistStore } from '../store/uiStore';
import { ArrowLeft, Download, Share2, Heart, MessageSquare, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatSidebar from '../components/ChatSidebar';
import { cn } from '../utils/cn';
import { exportToPDF } from '../utils/pdfExport';

// Import Tabs
import TabOverview from '../components/report-tabs/TabOverview';
import TabFinancials from '../components/report-tabs/TabFinancials';
import TabNews from '../components/report-tabs/TabNews';
import TabCompetitors from '../components/report-tabs/TabCompetitors';
import TabIndustry from '../components/report-tabs/TabIndustry';
import TabInvestment from '../components/report-tabs/TabInvestment';
import TabRisk from '../components/report-tabs/TabRisk';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'financials', label: 'Financials' },
  { id: 'news', label: 'News & Analysis' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'industry', label: 'Industry' },
  { id: 'investment', label: 'Investment' },
  { id: 'risk', label: 'Risk' }
];

/* ── helper: merge backend report into a shape the tabs can consume ── */
function buildDisplayData(report, ticker, partialReport) {
  // If we have a real report, use it
  const r = report || {};
  const pr = partialReport || {};
  const fd = pr.financialData || {};

  const actualTicker = r.ticker || ticker || 'N/A';
  const companyName = r.company_name || fd.longName || actualTicker;
  const price = fd.price || '';
  const priceChange = fd.priceChange ?? '';
  const priceChangePct = fd.priceChangePercent ?? '';

  const recColor = (rec) => {
    if (rec === 'BUY') return 'text-emerald-400';
    if (rec === 'SELL') return 'text-red-400';
    return 'text-yellow-500';
  };

  return {
    ticker: actualTicker,
    company_name: companyName,
    exchange: fd.exchange || 'NASDAQ',
    sector: fd.sector || r.company_overview?.match(/(\w+) sector/)?.[1] || 'Technology',
    price: price ? String(price) : '—',
    priceChange: priceChange !== '' ? (priceChange >= 0 ? `+${priceChange}` : String(priceChange)) : '',
    priceChangePercent: priceChangePct !== '' ? (priceChangePct >= 0 ? `+${priceChangePct}%` : `${priceChangePct}%`) : '',
    marketStatus: `Market Data · ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    recommendation: r.recommendation || 'HOLD',
    recColor: recColor(r.recommendation),
    investment_score: r.investment_score ?? 50,
    confidence_level: r.confidence_breakdown?.overall ?? 50,

    executive_summary: r.executive_summary || 'Generating executive summary...',

    key_takeaways: [
      ...(r.bull_case || []).slice(0, 3).map(t => ({ type: 'positive', text: t })),
      ...(r.bear_case || []).slice(0, 2).map(t => ({ type: 'negative', text: t }))
    ],

    financial_highlights: r.financial_highlights || [],

    key_financials: [
      { label: 'Market Cap', value: fd.marketCap || 'N/A' },
      { label: 'P/E Ratio', value: fd.peRatio ? `${fd.peRatio}x` : 'N/A' },
      { label: 'EPS', value: fd.eps ? `$${fd.eps}` : 'N/A' },
      { label: 'Revenue', value: fd.revenue || 'N/A' },
      { label: 'Gross Margin', value: fd.grossMargin || 'N/A' },
      { label: 'Debt to Equity', value: fd.debtToEquity ? `${fd.debtToEquity}` : 'N/A' },
      { label: 'Free Cash Flow', value: fd.freeCashFlow || 'N/A' },
      { label: 'Total Debt', value: fd.totalDebt || 'N/A' },
    ].filter(f => f.value !== 'N/A'),

    revenue_breakdown: [],

    financial_performance: [
      { year: 'TTM', revenue: parseFloat(String(fd.revenue || '0').replace(/[^0-9.]/g, '')) || 0, netIncome: 0, freeCashFlow: parseFloat(String(fd.freeCashFlow || '0').replace(/[^0-9.]/g, '')) || 0 }
    ],

    latest_news: (pr.newsData || []).slice(0, 6).map(n => ({
      title: n.title || 'Untitled',
      source: n.source || 'News',
      time: n.publishedDate ? new Date(n.publishedDate).toLocaleDateString() : 'Recently',
      sentiment: n.sentiment || 'Neutral',
      url: n.url || '#'
    })),

    competitors: (r.competitors || []).map(c => ({
      name: c.name,
      marketCap: c.revenue || 'N/A',
      peRatio: 'N/A',
      revenueGrowth: c.market_share || 'N/A',
      strength: c.strength || ''
    })),

    industry_updates: [],
    investments: [],

    industry_overview: {
      sector: fd.sector || fd.industry || 'Technology',
      description: r.company_overview || `${companyName} operates in the technology sector.`,
      trends: [],
      marketSize: 'N/A',
      cagr: 'N/A'
    },

    risk_assessment: (r.risks || []).map(risk => ({
      category: risk.risk_type,
      level: risk.severity,
      description: risk.description
    })),

    overall_risk: r.confidence_level || 'MEDIUM',

    ai_reasoning: r.executive_summary || 'Analysis pending...',

    bull_case: r.bull_case || [],
    bear_case: r.bear_case || [],

    confidence_breakdown: r.confidence_breakdown || { financial_data: 50, news_quality: 50, risk_analysis: 50, overall: 50 },

    sources: r.sources || [],
    next_research: r.next_research || [],

    suggested_questions: [
      `How is ${companyName} performing financially?`,
      `Compare ${actualTicker} with competitors`,
      `What is ${companyName}'s growth outlook?`,
      `Explain the risks for ${actualTicker}`,
      `Why did you recommend ${r.recommendation || 'HOLD'}?`
    ]
  };
}

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, report, partialReport, ticker, sessionId, processEvent } = useResearchStore();
  const { isWatched, toggle } = useWatchlistStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const eventSourceRef = useRef(null);

  const location = useLocation();
  const { fromHistory } = location.state || {};

  // ── Connect to SSE stream or load from history ──
  useEffect(() => {
    if (!id) return;

    if (fromHistory) {
      // Load from DB instead of streaming
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/research/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.data) {
            useResearchStore.setState({ 
              sessionId: id, 
              ticker: data.data.ticker,
              status: 'COMPLETED',
              report: data.data.content 
            });
          }
        })
        .catch(err => console.error('Failed to load report history:', err));
      return;
    }

    if (!ticker) return;
    
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/research/${id}/stream?ticker=${ticker}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === 'tool.calling') {
          setTimelineSteps(prev => [...prev, { label: parsed.payload.tool, status: 'running' }]);
        }

        if (parsed.type === 'tool.result') {
          setTimelineSteps(prev => {
            const updated = [...prev];
            const last = updated.findLast(s => s.status === 'running');
            if (last) last.status = 'done';
            return updated;
          });
        }

        processEvent(parsed);

        if (parsed.type === 'session.completed' || parsed.type === 'session.error') {
          setTimelineSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
          es.close();
        }
      } catch (e) {
        console.error('SSE parse error:', e);
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [id, ticker, fromHistory]);

  const data = buildDisplayData(report, ticker, partialReport);
  const isLoading = status === 'STARTING' || status === 'RUNNING';

  const handleBack = () => navigate('/');

  return (
    <div className="flex h-[calc(100vh-4rem)]">

      {/* Main Content Area */}
      <div id="report-content" className={cn("flex-1 overflow-y-auto pr-2 transition-all duration-300 scrollbar-hide", chatOpen ? "lg:mr-[380px]" : "")}>

        {/* Back Button */}
        <button onClick={handleBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-6 hide-on-print">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>

        {/* Hero Header */}
        <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/2" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10 relative">
            <div className="flex items-center gap-5">
              {/* Logo placeholder */}
              <div className="w-16 h-16 bg-black border border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                <span className="text-2xl font-black text-white">{(data.ticker || '?')[0]}</span>
              </div>

              <div>
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-3xl font-black text-white tracking-tight">{data.ticker}</h1>
                  {data.price && data.price !== '—' && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">${data.price}</span>
                      {data.priceChange && (
                        <span className={cn("text-sm font-bold", data.priceChange.startsWith('+') || data.priceChange.startsWith('-') ? (data.priceChange.startsWith('+') ? "text-emerald-400" : "text-red-400") : "text-zinc-400")}>
                          {data.priceChange} ({data.priceChangePercent})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-sm flex-wrap">
                  <span className="text-zinc-300 font-medium">{data.company_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 tracking-wider uppercase">{data.exchange}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800/50 text-emerald-500/80 tracking-wider uppercase border border-emerald-500/20">{data.sector}</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 font-medium">{data.marketStatus}</p>
              </div>
            </div>

            {/* Score & Recommendation */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Investment Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{data.investment_score}</span>
                  <span className="text-sm text-zinc-600 font-bold">/100</span>
                </div>
                <div className="w-28 h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${data.investment_score}%`, backgroundColor: data.investment_score >= 70 ? '#10b981' : data.investment_score >= 40 ? '#eab308' : '#ef4444' }} />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Recommendation</span>
                <span className={cn("text-2xl font-black", data.recColor)}>{data.recommendation}</span>
              </div>

              {/* Confidence circle */}
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="transparent" stroke="#27272a" strokeWidth="4" />
                  <circle cx="28" cy="28" r="24" fill="transparent" stroke={data.confidence_level >= 70 ? '#10b981' : data.confidence_level >= 40 ? '#eab308' : '#ef4444'} strokeWidth="4" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * (1 - data.confidence_level / 100)} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{data.confidence_level}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Research Timeline (while loading) */}
        {isLoading && timelineSteps.length > 0 && (
          <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> AI Research in Progress
            </h3>
            <div className="space-y-3">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-400 shrink-0" />
                  )}
                  <span className={step.status === 'done' ? 'text-zinc-400' : 'text-white font-medium'}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs & Actions */}
        <div className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl pb-3 mb-6 border-b border-zinc-800/60 pt-2 flex items-center justify-between gap-4 flex-wrap hide-on-print">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-bold transition-all relative rounded-lg whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-white bg-zinc-800/80"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-emerald-400" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => {
                setIsExporting(true);
                setTimeout(async () => {
                  await exportToPDF('pdf-export-container', `${data.ticker}_Report.pdf`);
                  setIsExporting(false);
                }, 500);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold rounded-xl transition-colors border border-zinc-800"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors border border-zinc-800">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => toggle(data.ticker)} className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors border", isWatched(data.ticker) ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800")}>
              <Heart className={cn("w-3.5 h-3.5", isWatched(data.ticker) && "fill-current")} /> Watchlist
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors border", chatOpen ? "bg-emerald-600 text-white border-emerald-500" : "bg-zinc-100 hover:bg-white text-black border-transparent")}>
              <MessageSquare className="w-3.5 h-3.5" /> Ask AI
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12 min-h-[60vh]">
          {isLoading && !report ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={cn("bg-[#121212] border border-zinc-800/60 rounded-2xl p-6 animate-pulse", i <= 2 ? "lg:col-span-2" : "")}>
                  <div className="h-4 w-32 bg-zinc-800 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-3 bg-zinc-800/60 rounded w-full" />
                    <div className="h-3 bg-zinc-800/60 rounded w-4/5" />
                    <div className="h-3 bg-zinc-800/60 rounded w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <TabOverview data={data} />}
                {activeTab === 'financials' && <TabFinancials data={data} />}
                {activeTab === 'news' && <TabNews data={data} />}
                {activeTab === 'competitors' && <TabCompetitors data={data} />}
                {activeTab === 'industry' && <TabIndustry data={data} />}
                {activeTab === 'risk' && <TabRisk data={data} />}
                {activeTab === 'investment' && <TabInvestment data={data} />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Right Sidebar - Chat */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[380px] bg-[#0A0A0A] border-l border-zinc-800/60 z-40 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between bg-zinc-900/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white text-sm">AI Analyst Chat</span>
                <span className="text-[10px] text-zinc-500 font-medium">Online</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors text-xs">✕</button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatSidebar data={data} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden container for full PDF Export */}
      {isExporting && (
        <div 
          id="pdf-export-container" 
          className="absolute top-0 left-0 w-[1200px] bg-[#0A0A0A] text-white p-12 z-[-50]"
          style={{ opacity: 0.01, pointerEvents: 'none' }}
        >
          {/* Header */}
          <div className="mb-12 border-b border-zinc-800/60 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-black border border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <span className="text-4xl font-black text-white">{(data.ticker || '?')[0]}</span>
                </div>
                <div>
                  <h1 className="text-5xl font-black text-white">{data.ticker}</h1>
                  <p className="text-2xl text-zinc-400 mt-2">{data.company_name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black text-white">${data.price}</div>
                <div className={cn("text-xl font-bold mt-2", data.priceChange >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {data.priceChange} ({data.priceChangePercent})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                <div className="text-sm text-zinc-400 uppercase tracking-wider font-bold mb-1">Recommendation</div>
                <div className={cn("text-2xl font-black", data.recColor)}>{data.recommendation}</div>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                <div className="text-sm text-zinc-400 uppercase tracking-wider font-bold mb-1">Investment Score</div>
                <div className="text-2xl font-black text-white">{data.investment_score}/100</div>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                <div className="text-sm text-zinc-400 uppercase tracking-wider font-bold mb-1">Confidence</div>
                <div className="text-2xl font-black text-white">{data.confidence_level}%</div>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            <div className="break-inside-avoid">
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-zinc-800 pb-3">Overview</h2>
              <TabOverview data={data} />
            </div>
            <div className="break-inside-avoid">
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-zinc-800 pb-3">Financial Performance</h2>
              <TabFinancials data={data} />
            </div>
            <div className="break-inside-avoid">
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-zinc-800 pb-3">News & Analysis</h2>
              <TabNews data={data} />
            </div>
            <div className="break-inside-avoid">
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-zinc-800 pb-3">Competitors</h2>
              <TabCompetitors data={data} />
            </div>
            <div className="break-inside-avoid">
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-zinc-800 pb-3">Industry & Market</h2>
              <TabIndustry data={data} />
            </div>
            <div className="break-inside-avoid">
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-zinc-800 pb-3">Risk Assessment</h2>
              <TabRisk data={data} />
            </div>
            <div className="break-inside-avoid">
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-zinc-800 pb-3">Investment Thesis</h2>
              <TabInvestment data={data} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportView;
