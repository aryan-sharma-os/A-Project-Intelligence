import React, { useEffect, useRef } from 'react';
import { useResearchStore } from '../store/researchStore';
import { Loader2, CheckCircle2, CircleDashed } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api/research';

export const AgentTrace = () => {
  const { sessionId, status, processEvent, events } = useResearchStore();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (status !== 'RUNNING' || !sessionId) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const sse = new EventSource(`${API_BASE_URL}/${sessionId}/stream`);
    eventSourceRef.current = sse;

    sse.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        processEvent(parsed);

        if (parsed.type === 'session.completed' || parsed.type === 'session.error') {
          sse.close();
        }
      } catch (err) {
        console.error('Failed to parse SSE event', err);
      }
    };

    sse.onerror = (error) => {
      console.error('SSE Error:', error);
      sse.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [sessionId, status, processEvent]);

  if (status !== 'RUNNING' && status !== 'STARTING') return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
        <h3 className="text-lg font-medium text-zinc-100">AI Agent Executing Research</h3>
      </div>
      
      <div className="space-y-4">
        {events.map((event, index) => {
          const isLatest = index === events.length - 1;
          return (
            <div key={index} className="flex gap-4">
              <div className="mt-1">
                {isLatest && status === 'RUNNING' ? (
                  <CircleDashed className="h-5 w-5 text-emerald-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-zinc-500" />
                )}
              </div>
              <div>
                <p className={\`text-sm font-medium \${isLatest ? 'text-zinc-200' : 'text-zinc-500'}\`}>
                  {event.type === 'tool.calling' ? 'Executing Tool' : 'Processing...'}
                </p>
                {event.payload?.tool && (
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    > {event.payload.tool}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
