import { memo } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  userInitial?: string;
}

export const ChatMessage = memo(function ChatMessage({ role, content, userInitial }: ChatMessageProps) {
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
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden',
          isAssistant ? 'bg-white border border-border/50' : 'bg-accent'
        )}
      >
        {isAssistant ? (
          <Image src="/icon.svg" alt="NS" width={22} height={22} className="rounded-sm" />
        ) : (
          <span className="text-sm font-semibold text-white leading-none">
            {userInitial || '?'}
          </span>
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
