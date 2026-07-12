import React from 'react';
import { ShieldCheck, Target, TrendingUp, Zap, ChevronDown, Newspaper, Briefcase, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/cn';

const Card = ({ title, children, icon: Icon, className: extraClass }) => (
  <div className={cn("bg-[#121212] border border-zinc-800/60 rounded-2xl p-6 flex flex-col h-full hover:border-zinc-700/80 transition-colors", extraClass)}>
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-4 h-4 text-emerald-400" />}
      <h3 className="font-bold text-white text-sm tracking-wide">{title}</h3>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const TabOverview = ({ data }) => {
  const hasRevBreakdown = data.revenue_breakdown && data.revenue_breakdown.length > 0;
  const hasNews = data.latest_news && data.latest_news.length > 0;
  const hasCompetitors = data.competitors && data.competitors.length > 0;
  const hasRisks = data.risk_assessment && data.risk_assessment.length > 0;

  return (
    <div className="space-y-6">

      {/* Row 1: Executive Summary + Highlights + Key Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Executive Summary */}
        <Card title="Executive Summary" icon={Zap} className="lg:col-span-1">
          <p className="text-zinc-300 leading-relaxed text-sm">{data.executive_summary}</p>
          {data.key_takeaways && data.key_takeaways.length > 0 && (
            <div className="mt-5 space-y-2.5">
              {data.key_takeaways.map((takeaway, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className={cn("font-bold mt-0.5", takeaway.type === 'positive' ? "text-emerald-500" : "text-red-500")}>
                    {takeaway.type === 'positive' ? '▲' : '▼'}
                  </span>
                  <span className="text-zinc-300">{takeaway.text}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">AI Generated</span>
          </div>
        </Card>

        {/* Executive Highlights */}
        <Card title="Executive Highlights" icon={Target}>
          {data.financial_highlights && data.financial_highlights.length > 0 ? (
            <div className="space-y-0.5">
              {data.financial_highlights.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-zinc-800/50 last:border-0 group hover:bg-zinc-900/50 rounded-lg px-2 -mx-2 transition-colors">
                  <span className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    <span className="text-xs">📊</span>
                    {h.metric_name}
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{h.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm italic">Financial highlights will appear once analysis completes.</p>
          )}
        </Card>

        {/* Key Financials */}
        <Card title="Key Financials" icon={TrendingUp}>
          {data.key_financials && data.key_financials.length > 0 ? (
            <div className="space-y-0.5">
              {data.key_financials.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 rounded-lg px-2 -mx-2 transition-colors">
                  <span className="text-sm font-medium text-zinc-400">{item.label}</span>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm italic">Key financials loading...</p>
          )}
        </Card>
      </div>

      {/* Row 2: Revenue Breakdown + Risk + News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Breakdown OR Placeholder */}
        {hasRevBreakdown ? (
          <Card title="Revenue Breakdown (TTM)" icon={ShieldCheck}>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.revenue_breakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
                    {data.revenue_breakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {data.revenue_breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-400 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          /* Risk Assessment (fallback when no revenue breakdown) */
          <Card title="Risk Assessment" icon={AlertTriangle}>
            {hasRisks ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Overall Risk</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                    data.overall_risk === 'HIGH' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                    data.overall_risk === 'LOW' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                    'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                  )}>{data.overall_risk}</span>
                </div>
                {data.risk_assessment.map((risk, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("w-3.5 h-3.5", risk.level === 'High' ? 'text-red-400' : risk.level === 'Low' ? 'text-emerald-400' : 'text-yellow-400')} />
                      <span className="text-sm text-zinc-300">{risk.category}</span>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                      risk.level === 'High' ? 'text-red-400 bg-red-500/10' :
                      risk.level === 'Low' ? 'text-emerald-400 bg-emerald-500/10' :
                      'text-yellow-400 bg-yellow-500/10'
                    )}>{risk.level}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm italic">Risk assessment loading...</p>
            )}
          </Card>
        )}

        {/* Latest News */}
        <Card title="Latest News" icon={Newspaper}>
          {hasNews ? (
            <div className="space-y-4">
              {data.latest_news.slice(0, 4).map((news, i) => (
                <div key={i} className="pb-3 border-b border-zinc-800/50 last:border-0 last:pb-0 group cursor-pointer">
                  <h4 className="text-sm font-bold text-zinc-300 leading-snug mb-1.5 group-hover:text-emerald-400 transition-colors line-clamp-2">{news.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-zinc-500">{news.source}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-zinc-600">{news.time}</span>
                    </div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                      news.sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-500/10' :
                      news.sentiment === 'Negative' ? 'text-red-400 bg-red-500/10' :
                      'text-yellow-400 bg-yellow-500/10'
                    )}>{news.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm italic">No news data available yet.</p>
          )}
        </Card>

        {/* Competitors */}
        <Card title="Top Competitors" icon={Briefcase}>
          {hasCompetitors ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Strength</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {data.competitors.slice(0, 4).map((c, i) => (
                    <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-2.5 text-sm font-bold text-white">{c.name}</td>
                      <td className="py-2.5 text-xs text-zinc-400">{c.strength || c.marketCap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-500 text-sm italic">Competitor data loading...</p>
          )}
        </Card>

      </div>

      {/* Data Sources */}
      {data.sources && data.sources.length > 0 && (
        <div className="flex items-center gap-4 px-2 pt-2">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Data powered by</span>
          {data.sources.map((s, i) => (
            <span key={i} className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabOverview;
