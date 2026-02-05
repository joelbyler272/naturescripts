import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Leaf, User } from 'lucide-react';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const ChatMessage = memo(function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAssistant ? 'bg-accent' : 'bg-foreground/10'
        )}
      >
        {isAssistant ? (
          <Leaf className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-foreground/70" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isAssistant
            ? 'bg-white border border-border/50 text-foreground'
            : 'bg-accent text-white'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
});
