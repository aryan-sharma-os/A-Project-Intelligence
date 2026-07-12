import React from 'react';
import { Newspaper, Sparkles, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';

const TabNews = ({ data }) => {
  const hasNews = data.latest_news && data.latest_news.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Latest News */}
      <div className="lg:col-span-2">
        <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-400" /> Latest News
            </h3>
          </div>

          {hasNews ? (
            <div className="space-y-4">
              {data.latest_news.map((news, i) => (
                <div key={i} className="p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-xl transition-all group cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-zinc-200 leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{news.source}</span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-[10px] text-zinc-600">{news.time}</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest",
                          news.sentiment === 'Positive' ? "bg-emerald-500/10 text-emerald-400" :
                          news.sentiment === 'Negative' ? "bg-red-500/10 text-red-400" :
                          "bg-yellow-500/10 text-yellow-400"
                        )}>
                          {news.sentiment}
                        </span>
                      </div>
                    </div>
                    {news.url && news.url !== '#' && (
                      <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-emerald-400 transition-colors shrink-0 mt-1">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No news data available. News will appear after the AI completes research.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI News Summary */}
      <div>
        <div className="bg-gradient-to-b from-[#121212] to-black border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none transform translate-x-1/3 -translate-y-1/2" />

          <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2 mb-6 relative z-10">
            <Sparkles className="w-4 h-4 text-emerald-400" /> AI News Analysis
          </h3>

          <div className="space-y-6 relative z-10">
            {hasNews ? (
              <>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sentiment Overview</h4>
                  <div className="flex gap-3">
                    {['Positive', 'Neutral', 'Negative'].map(s => {
                      const count = data.latest_news.filter(n => n.sentiment === s).length;
                      return count > 0 ? (
                        <div key={s} className={cn("px-2.5 py-1 rounded-lg text-xs font-bold",
                          s === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' :
                          s === 'Negative' ? 'bg-red-500/10 text-red-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        )}>
                          {count} {s}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Key Headlines</h4>
                  <ul className="space-y-2.5">
                    {data.latest_news.slice(0, 3).map((n, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className={cn("font-bold mt-0.5 shrink-0",
                          n.sentiment === 'Positive' ? 'text-emerald-500' :
                          n.sentiment === 'Negative' ? 'text-red-500' : 'text-yellow-500'
                        )}>
                          {n.sentiment === 'Positive' ? '+' : n.sentiment === 'Negative' ? '-' : '•'}
                        </span>
                        <span className="text-zinc-300 line-clamp-2">{n.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-zinc-500 text-sm italic">News analysis will appear once data is available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNews;
