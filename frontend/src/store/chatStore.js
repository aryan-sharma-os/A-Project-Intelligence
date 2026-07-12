import { create } from 'zustand';

const API_BASE = 'http://localhost:8000/api/v1/research';

export const useChatStore = create((set, get) => ({
  messages: [],
  isStreaming: false,
  
  addUserMessage: (content) => {
    set(state => ({ messages: [...state.messages, { role: 'user', content, id: Date.now() }] }));
  },

  streamResponse: async (sessionId) => {
    const messages = get().messages;
    set({ isStreaming: true });
    
    const aiMsgId = Date.now();
    set(state => ({ messages: [...state.messages, { role: 'ai', content: '', id: aiMsgId }] }));

    try {
      const res = await fetch(`${API_BASE}/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.map(m => ({ role: m.role, content: m.content })) }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === 'chat.chunk') {
                set(state => ({
                  messages: state.messages.map(m =>
                    m.id === aiMsgId ? { ...m, content: m.content + event.payload.text } : m
                  )
                }));
              }
              if (event.type === 'chat.done' || event.type === 'chat.error') {
                break;
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      set(state => ({
        messages: state.messages.map(m =>
          m.id === aiMsgId ? { ...m, content: 'Sorry, I encountered an error. Please try again.' } : m
        )
      }));
    }
    set({ isStreaming: false });
  },

  reset: () => set({ messages: [], isStreaming: false }),
}));
