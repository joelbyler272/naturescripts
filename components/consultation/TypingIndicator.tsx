import { Leaf } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div
      className="flex items-start gap-3"
      role="status"
      aria-live="polite"
      aria-label="Assistant is typing"
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent"
        aria-hidden="true"
      >
        <Leaf className="w-4 h-4 text-white" />
      </div>

      {/* Typing dots */}
      <div className="bg-white border border-border/50 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" />
        </div>
        <span className="sr-only">Assistant is typing...</span>
      </div>
    </div>
  );
}
