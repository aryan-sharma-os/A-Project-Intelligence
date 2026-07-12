import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/cn';

const KpiCard = ({ title, value, context }) => (
  <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
    <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h4>
    <div className="text-xl font-black text-white mb-1">{value}</div>
    {context && <div className="text-[11px] text-zinc-500">{context}</div>}
  </div>
);

const TabFinancials = ({ data }) => {
  const hasPerformance = data.financial_performance && data.financial_performance.length > 1;

  return (
    <div className="space-y-6">

      {/* KPI Grid from financial_highlights */}
      {data.financial_highlights && data.financial_highlights.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.financial_highlights.slice(0, 8).map((h, i) => (
            <KpiCard key={i} title={h.metric_name} value={h.value} context={h.context} />
          ))}
        </div>
      )}

      {/* Key Financials Table */}
      {data.key_financials && data.key_financials.length > 0 && (
        <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
          <h3 className="font-bold text-white text-sm tracking-wide mb-6">Key Financial Ratios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {data.key_financials.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/50 hover:bg-zinc-900/30 px-2 -mx-2 rounded transition-colors">
                <span className="text-sm font-medium text-zinc-400">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      {hasPerformance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm tracking-wide mb-6">Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.financial_performance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="year" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm tracking-wide mb-6">Free Cash Flow Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.financial_performance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fcfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="year" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="freeCashFlow" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#fcfGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* If no chart data, show a message */}
      {!hasPerformance && (
        <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-8 text-center">
          <p className="text-zinc-500 text-sm">Historical financial performance charts are available when multi-year data is provided by the research agents.</p>
        </div>
      )}
    </div>
  );
};

export default TabFinancials;
