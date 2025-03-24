"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { Message as MessageComponent } from "./Message";
import { useEffect, useRef } from "react";

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current && containerRef.current) {
      const scrollContainer = scrollAreaRef.current;
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollAreaRef}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" 
    >
      <div ref={containerRef} className="max-w-4xl mx-auto">
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
              <div className="flex flex-col max-w-[80%]">
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