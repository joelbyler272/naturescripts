'use client';

import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  timestamp?: string;
}

interface ConversationViewerProps {
  messages: Message[];
}

export function ConversationViewer({ messages }: ConversationViewerProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No conversation recorded
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isUser = message.role === 'user';
        
        return (
          <div
            key={message.id || index}
            className={cn(
              'flex gap-3',
              isUser ? 'flex-row' : 'flex-row'
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                isUser ? 'bg-blue-100' : 'bg-sage-100'
              )}
            >
              {isUser ? (
                <User className="w-4 h-4 text-blue-600" />
              ) : (
                <Bot className="w-4 h-4 text-sage-600" />
              )}
            </div>

            {/* Message */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {isUser ? 'User' : 'Assistant'}
                </span>
                {message.timestamp && (
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div
                className={cn(
                  'rounded-lg p-3 text-sm',
                  isUser ? 'bg-blue-50 text-gray-800' : 'bg-gray-50 text-gray-800'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
