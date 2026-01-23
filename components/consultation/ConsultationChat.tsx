'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Message } from '@/types';
import { Send, Leaf, User } from 'lucide-react';

interface ConsultationChatProps {
  initialMessages: Message[];
}

export function ConsultationChat({ initialMessages }: ConsultationChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message (in skeleton, just log it)
    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // TODO: Send to API in Phase 2
    console.log('Message sent:', input);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-primary/10">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'assistant' ? 'bg-primary' : 'bg-earth'
              }`}
            >
              {message.role === 'assistant' ? (
                <Leaf className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`flex-1 max-w-[80%] rounded-xl p-4 ${
                message.role === 'assistant'
                  ? 'bg-cream text-charcoal'
                  : 'bg-primary text-white'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-primary/10 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-charcoal/60 mt-2">
          Be as detailed as possible about your symptoms for the best recommendations
        </p>
      </div>
    </div>
  );
}
