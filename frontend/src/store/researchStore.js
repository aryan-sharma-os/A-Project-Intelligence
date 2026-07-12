import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1/research';

export const useResearchStore = create((set, get) => ({
  sessionId: null,
  ticker: null,
  status: 'IDLE', // IDLE, STARTING, RUNNING, COMPLETED, FAILED
  events: [],
  report: null,
  partialReport: {},
  error: null,

  startSession: async (ticker) => {
    set({ status: 'STARTING', ticker, events: [], report: null, partialReport: {}, error: null, sessionId: null });
    try {
      // POST request to trigger backend session
      const res = await axios.post(API_BASE_URL, { ticker });
      set({ sessionId: res.data.data.session_id, status: 'RUNNING' });
      return res.data.data.session_id;
    } catch (err) {
      set({ status: 'FAILED', error: err.response?.data?.error?.message || err.message });
      throw err;
    }
  },

  processEvent: (event) => {
    set((state) => {
      const updatedEvents = [...state.events, event];
      
      if (event.type === 'tool.result') {
        return { 
          events: updatedEvents, 
          partialReport: { ...state.partialReport, ...event.payload.data } 
        };
      }
      if (event.type === 'session.completed') {
        return { events: updatedEvents, status: 'COMPLETED', report: event.payload.report };
      }
      if (event.type === 'session.error') {
        return { events: updatedEvents, status: 'FAILED', error: event.payload.error };
      }
      
      return { events: updatedEvents };
    });
  },

  reset: () => set({ sessionId: null, ticker: null, status: 'IDLE', events: [], report: null, partialReport: {}, error: null }),
}));
