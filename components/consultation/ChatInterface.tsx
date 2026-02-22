'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ConversationMessage, GeneratedProtocol, ChatResponse } from '@/lib/consultation/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { createConsultation, checkCanConsult } from '@/lib/supabase/database';
import { logger } from '@/lib/utils/logger';
import { CHAT_LIMITS } from '@/lib/utils/validation';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { trackConsultationStarted, trackProtocolGenerated, trackLimitReached } from '@/lib/analytics/events';

interface ChatInterfaceProps {
  initialQuery?: string;
}

// Helper to create message objects
function createMessage(role: 'user' | 'assistant', content: string): ConversationMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    timestamp: new Date().toISOString()
  };
}

export function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const router = useRouter();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const consultationId = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProtocol, setGeneratedProtocol] = useState<GeneratedProtocol | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Abort in-flight requests on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Initialize chat
  const initializeChat = useCallback(async () => {
    if (user?.id) {
      try {
        const usageStatus = await checkCanConsult(user.id);

        if (!usageStatus.canConsult) {
          trackLimitReached(usageStatus.tier, usageStatus.currentCount);
          setUsageError('You have reached your weekly limit of 5 consultations. Upgrade to Pro for unlimited access.');
          return;
        }

        const userTier = (user.user_metadata?.tier as 'free' | 'pro') || 'free';
        const consultation = await createConsultation(
          user.id,
          initialQuery || 'New consultation',
          userTier
        );

        if (consultation) {
          consultationId.current = consultation.id;
          trackConsultationStarted(userTier);
        }
      } catch (error) {
        logger.error('Failed to initialize consultation:', error);
      }
    }

    // If there's an initial query, send it immediately
    if (initialQuery) {
      const userMessage = createMessage('user', initialQuery);
      setMessages([userMessage]);
      await sendToClaudeAPI([userMessage]);
    } else {
      // Show initial greeting
      const greeting = createMessage(
        'assistant',
        "Hello! I'm here to help create a personalized natural health protocol for you. What's been bothering you, or what would you like support with?"
      );
      setMessages([greeting]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, user?.id]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    initializeChat();
  }, [initializeChat]);

  // Send message to Claude API
  const sendToClaudeAPI = async (conversationHistory: ConversationMessage[]) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsTyping(true);

    try {
      const response = await fetch('/api/consultation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: conversationHistory[conversationHistory.length - 1].content,
          conversationHistory: conversationHistory.slice(0, -1),
          consultationId: consultationId.current
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data: ChatResponse = await response.json();

      const assistantMessage = createMessage('assistant', data.message);
      setMessages(prev => [...prev, assistantMessage]);
      setIsReadyToGenerate(data.isReadyToGenerate);

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      logger.error('Chat API error:', error);
      const errorMessage = createMessage(
        'assistant',
        "I'm having trouble connecting right now. Please try again in a moment."
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle user sending a message
  const handleUserMessage = async (content: string) => {
    if (content.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
      const errorMessage = createMessage(
        'assistant',
        `Your message is too long. Please keep messages under ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} characters.`
      );
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = createMessage('user', content);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await sendToClaudeAPI(updatedMessages);
  };

  // Generate protocol
  const handleGenerateProtocol = async () => {
    setIsGenerating(true);
    setIsReadyToGenerate(false);
    setIsTyping(true);

    try {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch('/api/consultation/protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: messages,
          consultationId: consultationId.current
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate protocol');
      }

      const data = await response.json();
      setGeneratedProtocol(data.protocol);

      const userTier = (user?.user_metadata?.tier as 'free' | 'pro') || 'free';
      trackProtocolGenerated(userTier);

      const successMessage = createMessage(
        'assistant',
        `Your protocol is ready! I've created ${data.protocol.recommendations.length} personalized recommendation${data.protocol.recommendations.length > 1 ? 's' : ''} based on our conversation.`
      );
      setMessages(prev => [...prev, successMessage]);

    } catch (error) {
      logger.error('Protocol generation error:', error);
      setSaveError('Failed to generate protocol. Please try again.');
      const errorMessage = createMessage(
        'assistant',
        "I had trouble generating your protocol. Please try again."
      );
      setMessages(prev => [...prev, errorMessage]);
      setIsReadyToGenerate(true); // Allow retry
    } finally {
      setIsTyping(false);
      setIsGenerating(false);
    }
  };

  const handleViewProtocol = () => {
    if (consultationId.current) {
      router.push(`/protocols/${consultationId.current}`);
    } else {
      router.push('/protocols');
    }
  };

  // Usage limit reached
  if (usageError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-white rounded-xl border border-border/50 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Weekly Limit Reached</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{usageError}</p>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/upgrade"
            className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-xl border border-border/50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} content={message.content} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Action buttons */}
        {(isReadyToGenerate || generatedProtocol) && !isGenerating && (
          <div className="flex justify-center pt-4 min-h-[60px]">
            {isReadyToGenerate && !generatedProtocol && (
              <button
                onClick={handleGenerateProtocol}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-[0_4px_20px_rgba(64,141,89,0.3)] hover:shadow-[0_6px_28px_rgba(64,141,89,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Generate my protocol
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {generatedProtocol && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleViewProtocol}
                  className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  View your protocol
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                {saveError && (
                  <p className="text-xs text-amber-600 text-center max-w-xs">{saveError}</p>
                )}
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleUserMessage}
        disabled={isTyping || isReadyToGenerate || isGenerating || !!generatedProtocol}
        placeholder={
          isReadyToGenerate
            ? "Click the button above to generate your protocol"
            : generatedProtocol
            ? "Protocol generated! Click to view."
            : "Share more details..."
        }
      />
    </div>
  );
}
