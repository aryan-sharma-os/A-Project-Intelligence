import React from 'react';
import { motion } from 'framer-motion';

const ConfidenceMeter = ({ confidence, breakdown }) => {
  const getOverallColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH': return 'text-emerald-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  if (!breakdown) {
    return (
      <div className="flex flex-col items-end">
        <div className="text-sm text-zinc-400 mb-1 font-medium tracking-wide uppercase">AI Confidence</div>
        <div className={`font-black text-2xl ${getOverallColor(confidence)}`}>{confidence || 'LOW'}</div>
      </div>
    );
  }

  const metrics = [
    { label: 'Financial Data', value: breakdown.financial_data },
    { label: 'News Quality', value: breakdown.news_quality },
    { label: 'Risk Analysis', value: breakdown.risk_analysis }
  ];

  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col items-center group">
            {/* Circular progress equivalent */}
            <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800">
              <svg className="w-10 h-10 transform -rotate-90 absolute inset-0">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-700" />
                <motion.circle 
                  cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - (m.value || 0) }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                  className={m.value > 80 ? 'text-emerald-500' : m.value > 50 ? 'text-yellow-500' : 'text-red-500'}
                />
              </svg>
              <span className="text-[10px] font-bold z-10 text-white">{m.value}%</span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 absolute -bottom-4 transition-opacity whitespace-nowrap">{m.label}</span>
          </div>
        ))}
      </div>
      
      <div className="h-10 w-px bg-zinc-800"></div>
      
      <div className="flex flex-col items-end">
        <div className="text-[10px] text-zinc-500 mb-0.5 font-bold tracking-widest uppercase">Overall Score</div>
        <div className="flex items-baseline gap-1">
          <span className={`font-black text-3xl leading-none ${getOverallColor(confidence)}`}>{breakdown.overall || 0}</span>
          <span className="text-zinc-600 font-bold text-sm">/100</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
