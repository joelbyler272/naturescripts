'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { ConsultationState, ConversationMessage, GeneratedProtocol } from '@/lib/consultation/types';
import { generateMockResponse, getInitialGreeting, createMessage, getResponseDelay } from '@/lib/consultation/mockAI';
import { generateProtocol } from '@/lib/consultation/generateProtocol';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  initialQuery?: string;
}

export function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, isTyping]);

  // Initialize conversation
  useEffect(() => {
    const initializeChat = async () => {
      setIsTyping(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const greeting = getInitialGreeting(initialQuery);
      const assistantMessage = createMessage('assistant', greeting);
      
      setState(prev => ({
        ...prev,
        messages: [assistantMessage],
      }));
      
      setIsTyping(false);
      
      // If there's an initial query, send it as user message after greeting
      if (initialQuery) {
        await new Promise(resolve => setTimeout(resolve, 300));
        handleUserMessage(initialQuery);
      }
    };
    
    initializeChat();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUserMessage = async (content: string) => {
    // Add user message
    const userMessage = createMessage('user', content);
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      questionCount: prev.questionCount + 1,
    }));
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, getResponseDelay()));
    
    // Get AI response
    const updatedState: ConsultationState = {
      ...state,
      messages: [...state.messages, userMessage],
      questionCount: state.questionCount + 1,
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
    setIsGenerating(true);
    
    // Add generating message
    const generatingMessage = createMessage('assistant', "Creating your personalized protocol... ✨");
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, generatingMessage],
    }));
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate protocol
    const protocol = generateProtocol(state);
    setGeneratedProtocol(protocol);
    
    // Add success message
    const successMessage = createMessage(
      'assistant', 
      `Your ${protocol.primaryConcern} protocol is ready! I've created ${protocol.recommendations.length} personalized recommendation${protocol.recommendations.length > 1 ? 's' : ''} based on our conversation.`
    );
    
    setState(prev => ({
      ...prev,
      messages: prev.messages.slice(0, -1).concat(successMessage), // Replace generating message
    }));
    
    setIsGenerating(false);
  };

  const handleViewProtocol = () => {
    if (generatedProtocol) {
      // In a real app, we'd save to database first
      // For now, store in sessionStorage and redirect
      sessionStorage.setItem('generated-protocol', JSON.stringify(generatedProtocol));
      router.push(`/protocols/${generatedProtocol.id}`);
    }
  };

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
            <Button
              onClick={handleGenerateProtocol}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-5 rounded-xl text-base"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate My Protocol
            </Button>
          </div>
        )}
        
        {/* View Protocol Button */}
        {generatedProtocol && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleViewProtocol}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-5 rounded-xl text-base"
            >
              View Your Protocol
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - disabled after protocol generation */}
      <ChatInput
        onSend={handleUserMessage}
        disabled={isTyping || isReadyToGenerate || isGenerating || !!generatedProtocol}
        placeholder={
          isReadyToGenerate
            ? "Click 'Generate My Protocol' above to continue"
            : generatedProtocol
            ? "Protocol generated! Click to view."
            : "Describe your symptoms or concerns..."
        }
      />
    </div>
  );
}
