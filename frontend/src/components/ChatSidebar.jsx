import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, Sparkles } from 'lucide-react';
import { useResearchStore } from '../store/researchStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../utils/cn';

const ChatSidebar = ({ data }) => {
  const { sessionId, ticker } = useResearchStore();
  const companyName = data?.company_name || ticker || 'this company';

  const [messages, setMessages] = useState([
    { role: 'assistant', content: `👋 Hi! I'm your AI investment analyst.\nAsk me anything about **${companyName}** or the ${data?.sector || 'technology'} sector.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setLoading(true);

    if (!sessionId) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Please wait for the research to complete before asking questions.' }]);
      setLoading(false);
      return;
    }

    try {
      // Add empty assistant message to stream into
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      // Send the full conversation history (only user/assistant messages, skip the initial greeting)
      const chatHistory = allMessages
        .filter((m, i) => i > 0) // skip the initial greeting
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`http://localhost:8000/api/v1/research/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Parse SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep the incomplete line

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.type === 'chat.chunk' && parsed.payload?.text) {
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: updated[updated.length - 1].content + parsed.payload.text
                  };
                  return updated;
                });
              } else if (parsed.type === 'chat.error') {
                // Break out of the inner loop and throw to the outer catch
                throw new Error(parsed.payload?.error || 'Stream error', { cause: 'CHAT_ERROR' });
              }
            } catch (e) {
              if (e.cause === 'CHAT_ERROR') throw e;
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const msgs = [...prev];
        if (msgs[msgs.length - 1]?.role === 'assistant' && msgs[msgs.length - 1]?.content === '') {
          msgs.pop();
        }
        return [...msgs, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }];
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = data?.suggested_questions || [
    `How is ${companyName} performing?`,
    `What are the main risks?`,
    `Compare with competitors`,
    `Explain the recommendation`
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] font-sans">

      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}

            <div className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === 'user'
                ? "bg-emerald-600 text-white rounded-tr-sm"
                : "bg-zinc-900/80 text-zinc-300 border border-zinc-800/60 rounded-tl-sm"
            )}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="prose prose-invert prose-sm max-w-full prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:text-white prose-strong:text-white">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-zinc-500 text-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-zinc-800/60 bg-[#0A0A0A]">
        {messages.filter(m => m.role === 'user').length === 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Suggested Questions</div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.slice(0, 4).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] rounded-lg transition-colors text-left leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black disabled:text-zinc-500 rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-zinc-600">AI can make mistakes. Verify important information.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
