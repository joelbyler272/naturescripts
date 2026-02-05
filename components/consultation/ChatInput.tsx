'use client';

import { useState, useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get correct scrollHeight
      textarea.style.height = 'auto';
      // Set new height based on content (max 150px)
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend(input.trim());
        setInput('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border/30 bg-white">
      <div
        className={cn(
          'relative flex items-end bg-secondary/30 rounded-xl border transition-all duration-200',
          isFocused
            ? 'border-accent shadow-[0_0_0_3px_rgba(107,142,127,0.1)]'
            : 'border-transparent hover:border-border/50'
        )}
      >
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || 'Type your message...'}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
          aria-describedby="chat-input-help"
          className={cn(
            'flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground',
            'focus:outline-none text-sm disabled:opacity-50 resize-none',
            'min-h-[44px] max-h-[150px]'
          )}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          aria-label="Send message"
          className={cn(
            'mr-2 mb-2 w-11 h-11 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
            input.trim() && !disabled
              ? 'bg-accent text-white hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50'
              : 'bg-secondary/50 text-muted-foreground'
          )}
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <p id="chat-input-help" className="text-xs text-muted-foreground mt-2 px-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
