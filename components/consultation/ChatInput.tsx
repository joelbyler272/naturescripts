'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border/30 bg-white">
      <div
        className={cn(
          'relative flex items-center bg-secondary/30 rounded-xl border transition-all duration-200',
          isFocused
            ? 'border-accent shadow-[0_0_0_3px_rgba(107,142,127,0.1)]'
            : 'border-transparent hover:border-border/50'
        )}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || 'Type your message...'}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            'mr-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all',
            input.trim() && !disabled
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'bg-secondary/50 text-muted-foreground'
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 px-1">
        Be as detailed as possible for the best recommendations
      </p>
    </form>
  );
}
