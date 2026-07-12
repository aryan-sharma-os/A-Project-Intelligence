import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useResearchStore } from '../store/researchStore';
import { CheckCircle2, CircleDashed, Search, Database, FileText, Globe, Users, ShieldAlert, BrainCircuit, FileSignature } from 'lucide-react';

const STAGES = [
  { id: 'Searching Yahoo Finance', label: 'Searching Yahoo Finance', icon: Search },
  { id: 'Reading NewsAPI', label: 'Reading NewsAPI', icon: Globe },
  { id: 'Comparing competitors', label: 'Comparing competitors', icon: Users },
  { id: 'Running financial analysis', label: 'Running financial analysis', icon: Database },
  { id: 'Evaluating market sentiment', label: 'Evaluating market sentiment', icon: FileText },
  { id: 'Calculating confidence', label: 'Calculating confidence', icon: ShieldAlert }
];

const ProgressTimeline = () => {
  const { events, status, ticker } = useResearchStore();

  const currentStageIndex = useMemo(() => {
    if (status === 'COMPLETED') return STAGES.length;
    let index = 0;
    // Find the furthest stage that has been executed
    events.forEach(e => {
      if (e.type === 'tool.calling') {
        const stageIndex = STAGES.findIndex(s => s.id === e.payload?.tool);
        if (stageIndex >= index) index = stageIndex;
      }
    });
    return index;
  }, [events, status]);

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
        <CircleDashed className="w-6 h-6 text-emerald-500 animate-spin" />
        Searching {ticker ? ticker.toUpperCase() : 'Company'}...
      </h2>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentStageIndex || status === 'COMPLETED';
          const isCurrent = index === currentStageIndex && status === 'RUNNING';
          const Icon = stage.icon;

          return (
            <motion.div 
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-black bg-zinc-800 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-500">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 absolute" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                ) : (
                  <div className="w-2 h-2 bg-zinc-600 rounded-full" />
                )}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 shadow">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isCurrent || isCompleted ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span className={`font-medium ${isCurrent || isCompleted ? 'text-white' : 'text-zinc-400'}`}>{stage.label}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTimeline;
