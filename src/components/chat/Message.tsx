"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, X, Paperclip } from "lucide-react";
import { Message as MessageType } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageProps {
  message: MessageType;
  isFeedbackVisible: boolean;
  onToggleFeedback: (messageId: string) => void;
}

export function Message({ message, isFeedbackVisible, onToggleFeedback }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="py-4 px-4 md:px-6"
    >
      {message.role === "user" ? (
        <div className="flex justify-end items-center">
          <div className="bg-black text-white rounded-2xl py-2 px-4 max-w-[80%]">
            {message.files && message.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.files.map(file => (
                  <div 
                    key={file.id} 
                    className="flex items-center bg-gray-700 rounded-lg px-2 py-1 text-xs"
                  >
                    <Paperclip size={12} className="mr-1" />
                    <span className="truncate max-w-[120px]">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col max-w-[80%]">
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => navigator.clipboard.writeText(message.content)}
            >
              <Copy size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => onToggleFeedback(message.id)}
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
          </div>
          {isFeedbackVisible && (
            <div className="flex items-center mt-4 p-2 border rounded-lg border-gray-200">
              <span className="text-sm text-gray-700 mr-2">Is this conversation helpful so far?</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <ThumbsUp size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <ThumbsDown size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100 ml-auto"
                onClick={() => onToggleFeedback(message.id)}
              >
                <X size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}