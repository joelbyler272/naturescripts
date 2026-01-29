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
import { createConsultation, updateConsultation, incrementDailyUsage } from '@/lib/supabase/database';
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, isTyping]);

  // Initialize conversation and track usage
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const initializeChat = async () => {
      // Increment usage and create consultation in database
      if (user?.id) {
        try {
          // Increment daily usage
          const usageResult = await incrementDailyUsage(user.id);
          
          if (!usageResult.canConsult) {
            setUsageError('You have reached your daily limit of 3 consultations. Upgrade to Pro for unlimited access.');
            return;
          }
          
          // Create consultation record
          const consultation = await createConsultation(
            user.id,
            initialQuery || 'New consultation',
            'free'
          );
          
          if (consultation) {
            consultationId.current = consultation.id;
          }
        } catch (error) {
          console.error('Error initializing consultation:', error);
          // Continue anyway - don't block the user
        }
      }
      
      const messages: ConversationMessage[] = [];
      
      // If there's an initial query, show it first as user message
      if (initialQuery) {
        const userMessage = createMessage('user', initialQuery);
        messages.push(userMessage);
        
        setState({
          messages,
          questionCount: 1,
          isComplete: false,
          collectedInfo: {},
        });
        
        // Show typing indicator
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, getResponseDelay()));
        
        // Get first follow-up question
        const firstQuestion = getFirstQuestion(initialQuery);
        const assistantMessage = createMessage('assistant', firstQuestion);
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
        
        setIsTyping(false);
      } else {
        // No initial query - show greeting
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
    // Add user message
    const userMessage = createMessage('user', content);
    const newQuestionCount = state.questionCount + 1;
    
    const updatedMessages = [...state.messages, userMessage];
    
    setState(prev => ({
      ...prev,
      messages: updatedMessages,
      questionCount: newQuestionCount,
    }));
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, getResponseDelay()));
    
    // Get AI response
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
    // Add user message "Generate my protocol"
    const userMessage = createMessage('user', 'Generate my protocol');
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    
    setIsGenerating(true);
    setIsReadyToGenerate(false);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate protocol
    const protocol = generateProtocol(state);
    setGeneratedProtocol(protocol);
    
    // Save to database
    if (consultationId.current && user?.id) {
      try {
        await updateConsultation(consultationId.current, {
          conversation_log: state.messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
          protocol_data: protocol as any,
          status: 'completed',
        });
      } catch (error) {
        console.error('Error saving consultation:', error);
      }
    }
    
    // Add success message
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
    if (generatedProtocol) {
      sessionStorage.setItem('generated-protocol', JSON.stringify(generatedProtocol));
      router.push(`/protocols/${generatedProtocol.id}`);
    }
  };

  // Show error if usage limit reached
  if (usageError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-white rounded-xl border border-border/50 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Daily Limit Reached</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {usageError}
        </p>
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
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {state.messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {/* Generate Protocol Button */}
        {isReadyToGenerate && !generatedProtocol && !isGenerating && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleGenerateProtocol}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              Generate my protocol
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* View Protocol Button */}
        {generatedProtocol && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleViewProtocol}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              View your protocol
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
