"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { Message } from "@/types/chat";
import { WelcomeMessage } from "./WelcomeMessage";
import { Message as MessageComponent } from "./Message";

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
  return (
    <ScrollArea className="flex-1">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 && <WelcomeMessage />}
        <AnimatePresence>
          {/* Static User Example Message */}
          <motion.div
            key="user-example" // Added unique key
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="py-8 px-4 md:px-6"
          >
            <div className="flex justify-end items-center">
              <div className="bg-black text-white rounded-2xl py-2 px-4 max-w-[80%]">
                <p>Hi</p>
              </div>
            </div>
          </motion.div>

          {/* Static Assistant Example Message */}
          <motion.div
            key="assistant-example" // Added unique key
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="py-4 px-4 md:px-6"
          >
            <div className="flex flex-col max-w-[80%]">
              <p className="mb-2">Hey! How's it going?</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                  onClick={() => {}}
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                  onClick={() => onToggleFeedback("example")}
                >
                  <ThumbsUp size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                  onClick={() => {}}
                >
                  <ThumbsDown size={16} />
                </Button>
              </div>
              {isFeedbackVisible && currentFeedbackId === "example" && (
                <div className="flex items-center mt-4 p-2 border rounded-lg border-gray-200">
                  <span className="text-sm text-gray-700 mr-2">
                    Is this conversation helpful so far?
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                  >
                    <ThumbsUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                  >
                    <ThumbsDown size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100 ml-auto"
                    onClick={() => onToggleFeedback("example")}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

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
                key="loading" // Added unique key
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
    </ScrollArea>
  );
}