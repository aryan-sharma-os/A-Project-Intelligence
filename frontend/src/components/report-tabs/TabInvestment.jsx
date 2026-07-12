import React from 'react';
import { Target, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { cn } from '../../utils/cn';

const TabInvestment = ({ data }) => {
  const bullCase = data.bull_case || [];
  const bearCase = data.bear_case || [];

  return (
    <div className="space-y-6">

      {/* Investment Decision Hero */}
      <div className="bg-gradient-to-br from-[#121212] to-black border border-zinc-800/60 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">

          <div className="flex-1">
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2 mb-6">
              <Target className="w-4 h-4 text-emerald-400" /> Final Investment Decision
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <span className={cn(
                "px-4 py-2 text-2xl font-black uppercase tracking-widest rounded-xl border",
                data.recommendation === 'BUY' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                data.recommendation === 'SELL' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
              )}>
                {data.recommendation}
              </span>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Confidence</span>
                <span className="text-white font-bold text-sm">{data.confidence_breakdown?.overall || data.confidence_level}%</span>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm max-w-2xl">{data.ai_reasoning}</p>
          </div>

          <div className="w-full md:w-64 shrink-0 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Investment Score</span>
              <span className="text-xl font-black text-white">{data.investment_score}<span className="text-xs text-zinc-600 font-bold">/100</span></span>
            </div>
            {data.confidence_breakdown && (
              <>
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Financial Data</span>
                  <span className="text-sm font-bold text-white">{data.confidence_breakdown.financial_data}%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">News Quality</span>
                  <span className="text-sm font-bold text-white">{data.confidence_breakdown.news_quality}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Risk Analysis</span>
                  <span className="text-sm font-bold text-white">{data.confidence_breakdown.risk_analysis}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bull vs Bear Debate */}
      {(bullCase.length > 0 || bearCase.length > 0) && (
        <>
          <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2 pt-2 px-2">
            <Scale className="w-4 h-4 text-emerald-400" /> AI Agent Debate
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bull Agent */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-400 text-sm">Bull Agent</h4>
                  <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Reasons to Buy</span>
                </div>
              </div>
              <ul className="space-y-3">
                {bullCase.map((reason, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-emerald-500 font-bold mt-0.5 shrink-0">▲</span>
                    <span className="text-zinc-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bear Agent */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h4 className="font-bold text-red-400 text-sm">Bear Agent</h4>
                  <span className="text-[10px] text-red-500/60 font-bold uppercase tracking-widest">Reasons to Avoid</span>
                </div>
              </div>
              <ul className="space-y-3">
                {bearCase.map((reason, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-red-500 font-bold mt-0.5 shrink-0">▼</span>
                    <span className="text-zinc-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Next Research Suggestions */}
      {data.next_research && data.next_research.length > 0 && (
        <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
          <h3 className="font-bold text-white text-sm tracking-wide mb-4">Suggested Next Research</h3>
          <div className="flex flex-wrap gap-2">
            {data.next_research.map((t, i) => (
              <span key={i} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg border border-zinc-700 hover:border-emerald-500/50 cursor-pointer transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabInvestment;
