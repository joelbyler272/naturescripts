'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ConsultationState, ConversationMessage, GeneratedProtocol } from '@/lib/consultation/types';
import { generateMockResponse, getFirstQuestion, createMessage, getResponseDelay } from '@/lib/consultation/mockAI';
import { generateProtocol } from '@/lib/consultation/generateProtocol';
import { useAuth } from '@/lib/auth/AuthContext';
import { createConsultation, updateConsultation, incrementDailyUsage, checkCanConsult } from '@/lib/supabase/database';
import { logger } from '@/lib/utils/logger';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ChatInterfaceProps {
  initialQuery?: string;
}

export function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const router = useRouter();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const consultationId = useRef<string | null>(null);

  const [state, setState] = useState<ConsultationState>({
    messages: [],
    questionCount: 0,
    isComplete: false,
    collectedInfo: {},
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProtocol, setGeneratedProtocol] = useState<GeneratedProtocol | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, isTyping]);

  // Initialize chat — check limit but do NOT increment yet
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeChat = async () => {
      if (user?.id) {
        try {
          // Only CHECK if they can consult — don't increment yet
          const usageStatus = await checkCanConsult(user.id);

          if (!usageStatus.canConsult) {
            setUsageError('You have reached your daily limit of 3 consultations. Upgrade to Pro for unlimited access.');
            return;
          }

          // Create consultation record (in_progress, no usage counted yet)
          // Use actual user tier from metadata, not hardcoded 'free'
          const userTier = (user.user_metadata?.tier as 'free' | 'pro') || 'free';
          const consultation = await createConsultation(
            user.id,
            initialQuery || 'New consultation',
            userTier
          );

          if (consultation) {
            consultationId.current = consultation.id;
          }
        } catch (error) {
          // Error logged via logger in database.ts
        }
      }

      const messages: ConversationMessage[] = [];

      if (initialQuery) {
        const userMessage = createMessage('user', initialQuery);
        messages.push(userMessage);

        setState({
          messages,
          questionCount: 1,
          isComplete: false,
          collectedInfo: {},
        });

        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, getResponseDelay()));

        const firstQuestion = getFirstQuestion(initialQuery);
        const assistantMessage = createMessage('assistant', firstQuestion);

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        setIsTyping(false);
      } else {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const greeting = "Hello! I'm here to help create a personalized natural health protocol for you. What's been bothering you, or what would you like support with?";
        const assistantMessage = createMessage('assistant', greeting);

        setState({
          messages: [assistantMessage],
          questionCount: 0,
          isComplete: false,
          collectedInfo: {},
        });

        setIsTyping(false);
      }
    };

    initializeChat();
  }, [initialQuery, user?.id]);

  const handleUserMessage = async (content: string) => {
    const userMessage = createMessage('user', content);
    const newQuestionCount = state.questionCount + 1;
    const updatedMessages = [...state.messages, userMessage];

    setState(prev => ({
      ...prev,
      messages: updatedMessages,
      questionCount: newQuestionCount,
    }));

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, getResponseDelay()));

    const updatedState: ConsultationState = {
      messages: updatedMessages,
      questionCount: newQuestionCount,
      isComplete: false,
      collectedInfo: state.collectedInfo,
    };

    const { message, isReadyToGenerate: ready } = generateMockResponse(updatedState);
    const assistantMessage = createMessage('assistant', message);

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      isComplete: ready,
    }));

    setIsTyping(false);
    setIsReadyToGenerate(ready);
  };

  const handleGenerateProtocol = async () => {
    const userMessage = createMessage('user', 'Generate my protocol');
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setIsGenerating(true);
    setIsReadyToGenerate(false);
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    const protocol = generateProtocol(state);
    setGeneratedProtocol(protocol);

    // Save protocol AND increment usage
    // We show a warning to user if save fails, but still show protocol
    let savedSuccessfully = false;
    if (consultationId.current && user?.id) {
      try {
        const allMessages = [...state.messages, userMessage];

        // Convert protocol to storage format safely
        const protocolForStorage = {
          id: protocol.id,
          size: protocol.size,
          summary: protocol.summary,
          primaryConcern: protocol.primaryConcern,
          recommendations: protocol.recommendations,
          lifestyleTips: protocol.lifestyleTips,
          warnings: protocol.warnings,
          createdAt: protocol.createdAt,
        };

        // Run both operations in parallel - both must succeed
        const [updateResult, usageResult] = await Promise.all([
          updateConsultation(consultationId.current, {
            conversation_log: allMessages.map(m => ({
              role: m.role,
              content: m.content,
              timestamp: m.timestamp,
            })),
            protocol_data: protocolForStorage as unknown as Record<string, unknown>,
            status: 'completed',
          }),
          incrementDailyUsage(user.id),
        ]);

        // Check both results - if either failed, show warning to user
        if (!updateResult) {
          logger.error('Failed to save consultation to database');
          setSaveError('Your protocol was generated but could not be saved. Please take a screenshot.');
        } else if (!usageResult.success) {
          logger.error('Failed to increment daily usage counter');
          // This is a backend issue, don't bother user
        } else {
          savedSuccessfully = true;
        }
      } catch (error) {
        logger.error('Error saving consultation:', error);
        setSaveError('Your protocol was generated but could not be saved. Please take a screenshot.');
      }
    } else {
      // No consultation ID means we couldn't create the record
      setSaveError('Protocol generated but session was not saved. Please take a screenshot.');
    }

    const successMessage = createMessage(
      'assistant',
      `Your ${protocol.primaryConcern} protocol is ready! I've created ${protocol.recommendations.length} personalized recommendation${protocol.recommendations.length > 1 ? 's' : ''} based on our conversation.`
    );

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, successMessage],
    }));

    setIsTyping(false);
    setIsGenerating(false);
  };

  const handleViewProtocol = () => {
    if (consultationId.current) {
      router.push(`/protocols/${consultationId.current}`);
    } else {
      // Fallback: show protocols list if no specific ID
      router.push('/protocols');
    }
  };

  if (usageError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-white rounded-xl border border-border/50 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Daily Limit Reached</h2>
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
        {state.messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} content={message.content} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Action buttons container - fixed height to prevent layout shift */}
        {(isReadyToGenerate || generatedProtocol) && !isGenerating && (
          <div className="flex justify-center pt-4 min-h-[60px]">
            {isReadyToGenerate && !generatedProtocol && (
              <button
                onClick={handleGenerateProtocol}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
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
