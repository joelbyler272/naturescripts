import { Leaf } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent">
        <Leaf className="w-4 h-4 text-white" />
      </div>

      {/* Typing dots */}
      <div className="bg-white border border-border/50 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
