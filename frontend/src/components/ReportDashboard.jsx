import React from 'react';
import ConfidenceMeter from './ConfidenceMeter';
import FinancialCharts from './FinancialCharts';
import ActionToolbar from './ActionToolbar';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ShieldAlert, ChevronRight, Sparkles, BarChart2 } from 'lucide-react';
import { useResearchStore } from '../store/researchStore';

// Skeleton pulse block
const Skeleton = ({ className }) => (
  <div className={`bg-zinc-800 animate-pulse rounded-xl ${className}`} />
);

const SectionCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl"
  >
    {children}
  </motion.div>
);

const ReportDashboard = () => {
  const { report, partialReport, status } = useResearchStore();

  // Merge final report with incremental streaming data
  const data = report || (() => {
    const pr = partialReport;
    if (!pr || Object.keys(pr).length === 0) return null;
    if (!pr.analysis_financial && !pr.finalReport) return null;
    return {
      ticker: pr.ticker,
      company_name: pr.financialData?.longName,
      executive_summary: pr.analysis_financial?.summary,
      bull_case: pr.analysis_financial?.key_strengths,
      bear_case: pr.analysis_risk?.macro_risks,
      financial_highlights: pr.financialData ? [
        pr.financialData.price && { metric_name: 'Stock Price', value: `$${pr.financialData.price}`, context: 'Current market price' },
        pr.financialData.marketCap && { metric_name: 'Market Cap', value: pr.financialData.marketCap, context: 'Total market cap' },
        pr.financialData.revenue && { metric_name: 'Revenue', value: pr.financialData.revenue, context: 'Annual revenue' },
        pr.financialData.peRatio && { metric_name: 'P/E Ratio', value: `${pr.financialData.peRatio}x`, context: 'Price-to-earnings' },
        pr.financialData.grossMargin && { metric_name: 'Gross Margin', value: pr.financialData.grossMargin, context: 'Profit margin' },
        pr.financialData.freeCashFlow && { metric_name: 'Free Cash Flow', value: pr.financialData.freeCashFlow, context: 'Cash after capex' },
      ].filter(Boolean) : null,
      risks: pr.analysis_risk?.micro_risks?.map((r, i) => ({
        risk_type: ['Operational', 'Market', 'Regulatory', 'Tech'][i % 4],
        severity: pr.analysis_risk.overall_risk_level === 'HIGH' ? 'High' : 'Medium',
        description: r
      })),
      recommendation: pr.decision?.recommendation,
      confidence_level: pr.decision?.confidence,
      investment_score: null,
      competitors: [],
      next_research: [],
      sources: [],
    };
  })();

  // Nothing to show yet
  if (!data) {
    if (status === 'RUNNING') {
      return (
        <div className="max-w-6xl mx-auto space-y-4 mt-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      );
    }
    return null;
  }

  const recConfig = {
    BUY: { cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50', icon: TrendingUp },
    SELL: { cls: 'bg-red-500/20 text-red-400 border-red-500/50', icon: TrendingDown },
    HOLD: { cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', icon: BarChart2 },
  };
  const rec = data.recommendation || 'HOLD';
  const RecIcon = recConfig[rec]?.icon || BarChart2;

  const priceChange = partialReport?.financialData?.priceChange || report?.priceChange;
  const isUp = parseFloat(priceChange) >= 0;

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* ── Header ── */}
      <SectionCard delay={0}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-black tracking-widest uppercase">
                <Sparkles className="w-3 h-3" /> AI Report
              </span>
              {status === 'RUNNING' && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />LIVE
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-black tracking-tight text-white">{data.ticker || '—'}</h1>
              {/* Real-time price */}
              {(partialReport?.financialData?.price || data.financial_highlights?.find(f => f.metric_name === 'Stock Price')) && (
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">
                    ${partialReport?.financialData?.price || data.financial_highlights?.find(f => f.metric_name === 'Stock Price')?.value?.replace('$', '')}
                  </span>
                  {priceChange && (
                    <span className={`text-sm font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? '+' : ''}{priceChange}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {data.company_name && (
              <p className="text-zinc-400 text-sm mt-1">{data.company_name}</p>
            )}

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {rec && (
                <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-sm border ${recConfig[rec]?.cls}`}>
                  <RecIcon className="w-4 h-4" /> {rec}
                </span>
              )}
              {data.investment_score > 0 && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700">
                  <span className="text-xs text-zinc-400 font-medium">Investment Score</span>
                  <span className="font-black text-white">{data.investment_score}</span>
                  <span className="text-zinc-600 text-xs">/100</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ConfidenceMeter confidence={data.confidence_level} breakdown={data.confidence_breakdown} />
            {report && <ActionToolbar report={report} />}
          </div>
        </div>
      </SectionCard>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">

          {data.executive_summary && (
            <SectionCard delay={0.05}>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="text-emerald-400 w-4 h-4" /> Executive Summary
              </h2>
              <p className="text-zinc-300 leading-relaxed">{data.executive_summary}</p>
            </SectionCard>
          )}

          {data.bull_case?.length > 0 && (
            <SectionCard delay={0.1}>
              <h2 className="text-lg font-bold mb-4">Bull vs Bear Case</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <h3 className="font-bold text-emerald-400 mb-3 text-sm uppercase tracking-wider">Bull Case</h3>
                  <ul className="space-y-2">
                    {data.bull_case.map((item, i) => (
                      <li key={i} className="text-sm text-zinc-300 flex gap-2">
                        <span className="text-emerald-500 mt-0.5">▲</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                  <h3 className="font-bold text-red-400 mb-3 text-sm uppercase tracking-wider">Bear Case</h3>
                  <ul className="space-y-2">
                    {data.bear_case?.map((item, i) => (
                      <li key={i} className="text-sm text-zinc-300 flex gap-2">
                        <span className="text-red-500 mt-0.5">▼</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>
          )}

          {data.competitors?.length > 0 && (
            <SectionCard delay={0.15}>
              <h2 className="text-lg font-bold mb-4">Competitor Analysis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.competitors.map((comp, i) => (
                  <div key={i} className="p-4 bg-black rounded-xl border border-zinc-800 flex flex-col gap-3">
                    <h3 className="font-bold text-white">{comp.name}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{comp.strength}</p>
                    <div className="pt-2 border-t border-zinc-800/50 flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Revenue</span>
                      <span className="text-sm font-bold text-emerald-400">{comp.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Next research suggestions */}
          {data.next_research?.length > 0 && (
            <SectionCard delay={0.2}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Recommended Next Research
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.next_research.map((t, i) => (
                  <a key={i} href={`/?ticker=${t}`} className="flex items-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-emerald-500/40 text-white text-sm font-bold rounded-xl transition-all group">
                    {t} <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  </a>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Sidebar column */}
        <div className="space-y-5">
          {data.financial_highlights?.length > 0 && (
            <SectionCard delay={0.1}>
              <h2 className="text-lg font-bold mb-4">Financial Highlights</h2>
              <div className="space-y-3">
                {data.financial_highlights.map((metric, i) => (
                  <div key={i} className="flex justify-between items-end pb-2 border-b border-zinc-800/60 last:border-0">
                    <div>
                      <div className="text-xs text-zinc-400 font-medium">{metric.metric_name}</div>
                      <div className="text-[10px] text-zinc-600 mt-0.5">{metric.context}</div>
                    </div>
                    <div className="font-bold text-emerald-400">{metric.value}</div>
                  </div>
                ))}
              </div>
              {data.financial_highlights.length > 0 && (
                <div className="mt-4">
                  <FinancialCharts highlights={data.financial_highlights} />
                </div>
              )}
            </SectionCard>
          )}

          {data.risks?.length > 0 && (
            <SectionCard delay={0.15}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="text-yellow-500 w-4 h-4" /> Risk Assessment
              </h2>
              <div className="space-y-3">
                {data.risks.map((risk, i) => (
                  <div key={i} className="p-3 bg-black rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${risk.severity === 'High' ? 'bg-red-500' : risk.severity === 'Medium' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                      <span className="font-bold text-xs text-white">{risk.risk_type}</span>
                      <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${risk.severity === 'High' ? 'bg-red-500/10 text-red-400' : risk.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{risk.description}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {data.sources?.length > 0 && (
            <SectionCard delay={0.2}>
              <h2 className="text-sm font-bold mb-3 text-zinc-400 uppercase tracking-wider">Data Sources</h2>
              <div className="flex flex-wrap gap-2">
                {data.sources.map((source, i) => (
                  <span key={i} className="px-3 py-1 bg-black text-zinc-400 text-xs rounded-full border border-zinc-800 font-medium">
                    {source}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
