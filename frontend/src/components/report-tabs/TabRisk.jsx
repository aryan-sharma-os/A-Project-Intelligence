import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const RiskRow = ({ category, level, description }) => {
  const getColors = (lvl) => {
    switch (lvl) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn("w-4 h-4",
            level === 'High' ? 'text-red-400' :
            level === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'
          )} />
          <span className="text-sm font-bold text-white">{category}</span>
        </div>
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border", getColors(level))}>
          {level}
        </span>
      </div>
      {description && <p className="text-xs text-zinc-400 leading-relaxed ml-6">{description}</p>}
    </div>
  );
};

const TabRisk = ({ data }) => {
  const hasRisks = data.risk_assessment && data.risk_assessment.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Risk Assessment */}
      <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
        <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2 mb-6">
          <ShieldAlert className="w-4 h-4 text-emerald-400" /> Risk Assessment
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Overall Risk Level</span>
          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
            data.overall_risk === 'HIGH' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
            data.overall_risk === 'LOW' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
            'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
          )}>
            {data.overall_risk}
          </span>
        </div>

        {hasRisks ? (
          <div className="space-y-3">
            {data.risk_assessment.map((risk, i) => (
              <RiskRow key={i} category={risk.category} level={risk.level} description={risk.description} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm italic">Risk data will appear once analysis completes.</p>
        )}
      </div>

      {/* Confidence Breakdown */}
      {data.confidence_breakdown && (
        <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-6">
          <h3 className="font-bold text-white text-sm tracking-wide mb-6">AI Confidence Breakdown</h3>
          <div className="space-y-5">
            {[
              { label: 'Financial Data Quality', value: data.confidence_breakdown.financial_data },
              { label: 'News Coverage Quality', value: data.confidence_breakdown.news_quality },
              { label: 'Risk Analysis Depth', value: data.confidence_breakdown.risk_analysis },
              { label: 'Overall Confidence', value: data.confidence_breakdown.overall }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-400 font-medium">{item.label}</span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.value >= 70 ? '#10b981' : item.value >= 40 ? '#eab308' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabRisk;
