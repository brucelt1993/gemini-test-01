import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { cn } from '../lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex w-full gap-4 py-8 px-4 md:px-8 transition-colors duration-200",
        isUser ? "bg-transparent" : "bg-zinc-50/50 border-y border-zinc-100"
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
            isUser ? "bg-zinc-900 text-white" : "bg-emerald-600 text-white"
          )}
        >
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {isUser ? "You" : "Gemini Nexus"}
        </div>
        <div className="prose prose-zinc max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-code:text-emerald-600 prose-code:bg-emerald-50 prose-code:px-1 prose-code:rounded">
          {isUser ? (
            <p className="whitespace-pre-wrap text-zinc-800">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
