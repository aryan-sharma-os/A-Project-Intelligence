import React from 'react';
import { TrendingUp } from 'lucide-react';

const TabIndustry = ({ data }) => {
  const overview = data.industry_overview || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Industry Overview */}
      <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
        <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Industry Overview
        </h3>

        <div className="mb-4">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{overview.sector || 'Technology'}</span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">{overview.description || 'Industry analysis will appear once research is complete.'}</p>

        {overview.marketSize && overview.marketSize !== 'N/A' && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Market Size</span>
              <span className="text-xl font-black text-white">{overview.marketSize}</span>
            </div>
            {overview.cagr && overview.cagr !== 'N/A' && (
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">CAGR</span>
                <span className="text-xl font-black text-emerald-400">{overview.cagr}</span>
              </div>
            )}
          </div>
        )}

        {overview.trends && overview.trends.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Key Trends</h4>
            <ul className="space-y-3">
              {overview.trends.map((trend, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-zinc-300">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Company Overview */}
      <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
        <h3 className="font-bold text-white text-sm tracking-wide mb-6">Company Context</h3>
        <p className="text-sm text-zinc-300 leading-relaxed">{data.ai_reasoning}</p>

        {/* Next Research */}
        {data.next_research && data.next_research.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Related Companies</h4>
            <div className="flex flex-wrap gap-2">
              {data.next_research.map((t, i) => (
                <span key={i} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg border border-zinc-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {data.sources && data.sources.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
              {data.sources.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-900 text-zinc-400 text-[10px] font-bold rounded border border-zinc-800 uppercase tracking-wider">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabIndustry;
