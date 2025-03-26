"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/types/chat";
import { Message as MessageComponent } from "./Message";
import { useEffect, useRef, useState } from "react";
import { AnalysisResult } from "@/types/files";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  currentFeedbackId: string | null;
  isFeedbackVisible: boolean;
  onToggleFeedback: (messageId: string) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  currentFeedbackId,
  isFeedbackVisible,
  onToggleFeedback,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current && containerRef.current) {
      const scrollContainer = scrollAreaRef.current;
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
    }
  }, [messages, isLoading]);

  // Function to analyze file content directly from the messages component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const analyzeFile = async (file: File, mode: string = 'study'): Promise<AnalysisResult | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze file');
      }
      
      const data = await response.json();
      if (data.success && data.analysisResult) {
        return data.analysisResult;
      }
      return null;
    } catch (error) {
      console.error('Error analyzing file:', error);
      return null;
    }
  };

  return (
    <div 
      ref={scrollAreaRef}
      className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${
        isMobile ? 'pb-4' : ''
      }`}
    >
      <div 
        ref={containerRef} 
        className={`${isMobile ? 'max-w-full px-2' : 'max-w-4xl mx-auto'}`}
      >
        <AnimatePresence>
          {/* Dynamic Messages */}
          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              isFeedbackVisible={isFeedbackVisible && currentFeedbackId === message.id}
              onToggleFeedback={onToggleFeedback}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 px-4 md:px-6"
            >
              <div className={`flex flex-col ${isMobile ? 'max-w-[90%]' : 'max-w-[80%]'}`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}