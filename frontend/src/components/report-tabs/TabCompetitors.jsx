import React from 'react';
import { GitCompare } from 'lucide-react';
import { cn } from '../../utils/cn';

const TabCompetitors = ({ data }) => {
  const hasCompetitors = data.competitors && data.competitors.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-emerald-400" /> Competitor Comparison
          </h3>
        </div>

        {hasCompetitors ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50">
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">Company</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">Revenue / Market Share</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">Key Strength</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {/* Target Company (Highlighted) */}
                <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-black text-white text-sm">{data.ticker}</span>
                      <span className="text-xs text-zinc-500">({data.company_name})</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-zinc-300 text-sm whitespace-nowrap">
                    {data.financial_highlights?.find(f => f.metric_name.includes('Revenue'))?.value || '—'}
                  </td>
                  <td className="py-4 px-6 text-xs text-zinc-400">Current Research Target</td>
                </tr>

                {/* Competitors */}
                {data.competitors.map((comp, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{comp.name}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-zinc-400 text-sm whitespace-nowrap">{comp.revenueGrowth || comp.marketCap || '—'}</td>
                    <td className="py-4 px-6 text-xs text-zinc-500">{comp.strength || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <GitCompare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Competitor data will appear once the AI research is complete.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabCompetitors;
