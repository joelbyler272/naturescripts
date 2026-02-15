'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/components/consultation/ChatMessage';
import { ChatInput } from '@/components/consultation/ChatInput';
import { TypingIndicator } from '@/components/consultation/TypingIndicator';
import { ConversationMessage } from '@/lib/consultation/types';
import { 
  OnboardingState, 
  createInitialState, 
  processOnboardingMessage,
  isReadyForProtocol,
  getProfileData
} from '@/lib/onboarding/stateMachine';
import { logger } from '@/lib/utils/logger';
import { Mail, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface OnboardingChatProps {
  initialQuery?: string;
}

function createMessage(role: 'user' | 'assistant', content: string): ConversationMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    role,
    content,
    timestamp: new Date().toISOString()
  };
}

export function OnboardingChat({ initialQuery }: OnboardingChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(createInitialState());
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionState, setCompletionState] = useState<'idle' | 'creating' | 'done' | 'error'>('idle');
  const [existingUserError, setExistingUserError] = useState<boolean>(false);

  const onboardingStateRef = useRef(onboardingState);
  const mountedRef = useRef(true);

  // Keep onboardingStateRef in sync
  useEffect(() => {
    onboardingStateRef.current = onboardingState;
  }, [onboardingState]);

  // Track mounted state for cleanup (must set true in body for React StrictMode)
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Auto-scroll to bottom of messages container
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  }, [messages, isTyping]);

  // Initialize
  const initializeChat = useCallback(async () => {
    const greeting = createMessage(
      'assistant',
      "Hi there! I'm here to help create a personalized natural health protocol for you. What's been bothering you, or what would you like support with?"
    );
    setMessages([greeting]);

    // If there's an initial query, process it immediately
    if (initialQuery) {
      // Small delay to show greeting first
      setTimeout(() => {
        handleUserMessage(initialQuery);
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    initializeChat();
  }, [initializeChat]);

  // Handle user message with state machine
  const handleUserMessage = async (content: string) => {
    const userMessage = createMessage('user', content);
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Process through state machine (use ref to avoid stale closure)
    const result = processOnboardingMessage({
      message: content,
      state: onboardingStateRef.current,
    });

    console.log('STATE MACHINE RESULT:', {
      step: result.newState.step,
      reply: result.reply,
      needsApiCall: result.needsApiCall,
      apiCallType: result.apiCallType,
    });

    // Small delay to feel natural
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    if (!mountedRef.current) return;

    if (result.needsApiCall && result.apiCallType === 'clarifying') {
      // Make the ONE clarifying question API call (with retry for transient errors)
      let clarifySuccess = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch('/api/onboarding/clarify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              state: result.newState,
            }),
          });

          if (!mountedRef.current) return;

          if (response.ok) {
            const data = await response.json();
            const assistantMessage = createMessage('assistant', data.question);
            setMessages(prev => [...prev, assistantMessage]);
            clarifySuccess = true;
            break;
          }
          // Non-OK response — retry if transient (5xx)
          if (response.status < 500) break;
          if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        } catch (error) {
          logger.error(`Clarifying question attempt ${attempt}/3 failed:`, error);
          if (!mountedRef.current) return;
          if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
      }
      if (!clarifySuccess) {
        // Build a specific fallback using what the user actually told us
        const concern = result.newState.primaryConcern?.toLowerCase() || 'that';
        const fallbackQuestion = `${result.newState.firstName}, have you noticed anything that tends to make your ${concern} better or worse — like certain activities, foods, or time of day?`;
        const assistantMessage = createMessage('assistant', fallbackQuestion);
        setMessages(prev => [...prev, assistantMessage]);
      }
    } else if (result.newState.step === 'ready') {
      // Email captured — skip the "I have everything" message and auto-generate
      setOnboardingState(result.newState);
      setIsTyping(false);
      // Auto-trigger protocol generation
      handleGenerateProtocolWithState(result.newState);
      return;
    } else if (result.reply) {
      // Use hardcoded response
      const assistantMessage = createMessage('assistant', result.reply);
      setMessages(prev => [...prev, assistantMessage]);
    }

    setOnboardingState(result.newState);
    setIsTyping(false);
  };

  // Generate protocol with automatic retries for transient errors
  const MAX_RETRIES = 3;

  const handleGenerateProtocolWithState = async (stateOverride?: OnboardingState) => {
    const currentState = stateOverride || onboardingState;
    if (!isReadyForProtocol(currentState)) return;

    setIsGenerating(true);
    setCompletionState('creating');

    const profileData = getProfileData(currentState);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: profileData.email,
            state: currentState,
            conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.existingUser) {
            setExistingUserError(true);
            setCompletionState('error');
            setIsGenerating(false);
            return;
          }
          throw new Error(errorData.error || 'Failed to complete onboarding');
        }

        await response.json();
        // Add a chat message confirming the email was sent
        const doneMessage = createMessage(
          'assistant',
          `Great news, ${currentState.firstName}! Your personalized protocol is ready. I've sent an email to ${currentState.email} with a link to set your password and view your full protocol. Check your inbox (and spam folder) to get started!`
        );
        setMessages(prev => [...prev, doneMessage]);
        setOnboardingState(prev => ({ ...prev, step: 'complete' }));
        setCompletionState('done');
        setIsGenerating(false);
        return; // Success — exit

      } catch (error) {
        logger.error(`Protocol generation attempt ${attempt}/${MAX_RETRIES} failed:`, error);

        if (attempt < MAX_RETRIES) {
          // Wait before retrying (2s, then 4s)
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        } else {
          // All retries exhausted
          setCompletionState('error');
          setIsGenerating(false);
        }
      }
    }
  };

  const isChatDisabled = isTyping || isGenerating || completionState === 'done' || completionState === 'creating';

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-xl border border-border/50 overflow-hidden">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ overflowAnchor: 'auto' }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            userInitial={onboardingState.firstName ? onboardingState.firstName.charAt(0).toUpperCase() : undefined}
          />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Existing user error */}
        {existingUserError && (
          <div className="flex flex-col items-center pt-6 pb-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Account Already Exists</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              It looks like you already have an account with <span className="font-medium text-foreground">{onboardingState.email}</span>. Please sign in to continue.
            </p>
            <Link href="/sign-in" className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
              Sign In
            </Link>
          </div>
        )}

        {/* Protocol ready — message is shown as a chat bubble above */}

        {/* Auto-generating protocol indicator */}
        {isGenerating && completionState === 'creating' && (
          <div className="flex flex-col items-center pt-6 pb-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Creating your personalized protocol...
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              This usually takes about 15-30 seconds. Hang tight!
            </p>
          </div>
        )}

        {/* Error with retry button */}
        {completionState === 'error' && !existingUserError && (
          <div className="flex flex-col items-center pt-6 pb-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              We had trouble creating your protocol. This is usually temporary — please try again.
            </p>
            <button
              onClick={() => handleGenerateProtocolWithState(onboardingState)}
              disabled={isGenerating}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleUserMessage}
        disabled={isChatDisabled}
        placeholder={
          completionState === 'done' ? "Check your email to access your protocol" :
          completionState === 'creating' ? "Creating your personalized protocol..." :
          "Share more details..."
        }
      />
    </div>
  );
}
