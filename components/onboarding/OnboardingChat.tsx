'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/components/consultation/ChatMessage';
import { ChatInput } from '@/components/consultation/ChatInput';
import { TypingIndicator } from '@/components/consultation/TypingIndicator';
import { ConversationMessage, GeneratedProtocol } from '@/lib/consultation/types';
import { logger } from '@/lib/utils/logger';
import { CHAT_LIMITS } from '@/lib/utils/validation';
import { ArrowRight, Mail, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface OnboardingChatProps {
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

export function OnboardingChat({ initialQuery }: OnboardingChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProtocol, setGeneratedProtocol] = useState<GeneratedProtocol | null>(null);
  const [collectedEmail, setCollectedEmail] = useState<string | null>(null);
  const [completionState, setCompletionState] = useState<'idle' | 'creating' | 'done' | 'error'>('idle');
  const [firstName, setFirstName] = useState<string>('Friend');
  const [existingUserError, setExistingUserError] = useState<boolean>(false);

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
    if (initialQuery) {
      // If there's an initial query, send it immediately
      const userMessage = createMessage('user', initialQuery);
      setMessages([userMessage]);
      await sendToAPI([userMessage]);
    } else {
      // Show initial greeting
      const greeting = createMessage(
        'assistant',
        "Hi there! I'm here to help create a personalized natural health protocol for you. What's been bothering you, or what would you like support with?"
      );
      setMessages([greeting]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    initializeChat();
  }, [initializeChat]);

  // Send message to onboarding API
  const sendToAPI = async (conversationHistory: ConversationMessage[]) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsTyping(true);

    try {
      const response = await fetch('/api/onboarding/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: conversationHistory[conversationHistory.length - 1].content,
          conversationHistory: conversationHistory.slice(0, -1),
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = createMessage('assistant', data.message);
      setMessages(prev => [...prev, assistantMessage]);

      // Check if email was collected in this response
      if (data.collectedEmail) {
        setCollectedEmail(data.collectedEmail);
      }

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      logger.error('Onboarding chat API error:', error);
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

    // Check if this message contains an email
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    const emailMatch = content.match(emailPattern);
    if (emailMatch) {
      setCollectedEmail(emailMatch[0].toLowerCase());
    }

    await sendToAPI(updatedMessages);
  };

  // Complete onboarding - create account and generate protocol
  const handleCompleteOnboarding = async () => {
    if (!collectedEmail) {
      return;
    }

    setIsGenerating(true);
    setCompletionState('creating');

    try {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: collectedEmail,
          conversationHistory: messages,
        }),
        signal: controller.signal
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.existingUser) {
          // User already exists - show sign in prompt
          setExistingUserError(true);
          setCompletionState('error');
          return;
        }
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      // Success!
      setGeneratedProtocol(data.protocol);
      setFirstName(data.firstName || 'Friend');
      setCompletionState('done');

    } catch (error) {
      logger.error('Onboarding completion error:', error);
      setCompletionState('error');
      const errorMessage = createMessage(
        'assistant',
        "I had trouble creating your account. Please try again."
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Determine if chat input should be disabled
  // Disable after email is collected (user should click button, not type more)
  const isChatDisabled = isTyping || isGenerating || completionState === 'done' || completionState === 'creating' || (collectedEmail !== null);

  // Determine placeholder text
  const getPlaceholderText = () => {
    if (completionState === 'done') {
      return "Check your email to access your protocol";
    }
    if (completionState === 'creating' || isGenerating) {
      return "Creating your protocol...";
    }
    if (collectedEmail) {
      return "Click the button above to generate your protocol";
    }
    return "Share more details...";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-xl border border-border/50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} content={message.content} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Existing user error - show sign in prompt */}
        {existingUserError && (
          <div className="flex flex-col items-center pt-6 pb-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Account Already Exists
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              It looks like you already have an account with <span className="font-medium text-foreground">{collectedEmail}</span>. Please sign in to continue your consultation.
            </p>
            <Link
              href="/sign-in"
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Completion state - protocol ready */}
        {completionState === 'done' && generatedProtocol && (
          <div className="flex flex-col items-center pt-6 pb-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your protocol is ready, {firstName}!
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              We've sent an email to <span className="font-medium text-foreground">{collectedEmail}</span> with a link to set your password and access your full protocol.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg">
              <Mail className="w-4 h-4" />
              Check your inbox (and spam folder)
            </div>
          </div>
        )}

        {/* Generate button - only show when email is collected AND not done yet AND no error */}
        {collectedEmail && !generatedProtocol && !existingUserError && completionState !== 'done' && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleCompleteOnboarding}
              disabled={isGenerating || completionState === 'creating'}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
            >
              {completionState === 'creating' || isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating your protocol...
                </>
              ) : (
                <>
                  Generate my protocol
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleUserMessage}
        disabled={isChatDisabled}
        placeholder={getPlaceholderText()}
      />
    </div>
  );
}
