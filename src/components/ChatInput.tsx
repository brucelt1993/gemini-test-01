import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative max-w-4xl mx-auto w-full px-4 mb-8"
    >
      <div className="relative flex items-end w-full bg-white rounded-2xl border border-zinc-200 shadow-sm focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400 transition-all duration-200 overflow-hidden">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini Nexus anything..."
          className="w-full resize-none bg-transparent py-4 pl-4 pr-14 focus:outline-none text-zinc-800 placeholder:text-zinc-400 min-h-[56px] max-h-[200px]"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-200",
            input.trim() && !disabled
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          )}
        >
          <ArrowUp size={20} />
        </button>
      </div>
      <p className="text-[10px] text-center text-zinc-400 mt-2">
        Gemini Nexus can make mistakes. Check important info.
      </p>
    </form>
  );
};
