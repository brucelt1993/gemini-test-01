import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Trash2, Github, Bot } from 'lucide-react';
import { Message, ChatState } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { createChatSession, streamMessage } from './services/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  useEffect(() => {
    try {
      chatRef.current = createChatSession();
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  const handleSend = async (content: string) => {
    if (!chatRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantMessage],
      isLoading: true,
    }));

    try {
      let fullContent = '';
      const stream = streamMessage(chatRef.current, content);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: fullContent }
              : msg
          ),
        }));
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, error: "Failed to get response. Please try again." }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearChat = () => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
    chatRef.current = createChatSession();
  };

  return (
    <div className="flex flex-col h-screen bg-white text-zinc-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Gemini Nexus</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth" ref={scrollRef}>
        {state.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                <MessageSquare className="text-zinc-400" size={32} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">How can I help you today?</h2>
              <p className="text-zinc-500 text-lg mb-8">
                I'm your intelligent assistant, ready to help you write, code, learn, or just chat.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  "Write a professional email to a client",
                  "Explain quantum computing in simple terms",
                  "Help me debug a React useEffect hook",
                  "Suggest 5 healthy dinner recipes"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="p-4 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200 text-sm text-zinc-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col pb-32">
            {state.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {state.isLoading && state.messages[state.messages.length - 1]?.content === '' && (
              <div className="flex gap-4 py-8 px-4 md:px-8 bg-zinc-50/50 border-y border-zinc-100">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600 text-white animate-pulse">
                    <Bot size={18} />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Gemini Nexus</div>
                  <div className="flex gap-1 items-center h-6">
                    <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            {state.error && (
              <div className="px-4 md:px-8 py-4">
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {state.error}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10">
        <ChatInput onSend={handleSend} disabled={state.isLoading} />
      </div>
    </div>
  );
}
