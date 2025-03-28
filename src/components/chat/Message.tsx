"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, X, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { Message as MessageType } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { useState, useEffect } from "react";

interface MessageProps {
  message: MessageType;
  isFeedbackVisible: boolean;
  onToggleFeedback: (messageId: string) => void;
}

export function Message({ message, isFeedbackVisible, onToggleFeedback }: MessageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if we're on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // On mobile, long messages should start collapsed
  useEffect(() => {
    if (isMobile && message.role === "assistant" && message.content.length > 300) {
      setIsExpanded(false);
    }
  }, [isMobile, message]);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="py-3 px-3 md:py-4 md:px-6"
    >
      {message.role === "user" ? (
        <div className="flex justify-end items-center">
          <div className="bg-black text-white rounded-2xl py-2 px-3 md:px-4 max-w-[90%] md:max-w-[80%]">
            {message.files && message.files.length > 0 && (
              <div className="flex flex-wrap gap-1 md:gap-2 mb-1 md:mb-2">
                {message.files.map(file => (
                  <div 
                    key={file.id} 
                    className="flex items-center bg-gray-700 rounded-lg px-2 py-0.5 md:py-1 text-xs"
                  >
                    <Paperclip size={10} className="mr-1" />
                    <span className="truncate max-w-[100px] md:max-w-[120px]">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col max-w-[90%] md:max-w-[80%]">
          <div 
            style={{ overflowY: "hidden" }}
            className={`prose prose-sm dark:prose-invert ${isMobile && !isExpanded ? "max-h-[150px] relative" : ""}`}
          >
            {isMobile && !isExpanded && (
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-gray-900" />
            )}
            
            <div className="markdown-body">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({node, ...props}) => <p className="break-words" {...props} />,
                  pre: ({node, ...props}) => (
                    <div className="overflow-x-auto">
                      <pre {...props} />
                    </div>
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto">
                      <table {...props} />
                    </div>
                  ),
                  img: ({node, ...props}) => (
                    <img style={{ maxWidth: "100%" }} {...props} />
                  ),
                  code: ({node, inline, ...props}: {node?: any; inline?: boolean; [key: string]: any}) => 
                    inline ? <code {...props} /> : (
                      <div className="overflow-x-auto">
                        <code {...props} />
                      </div>
                    )
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Show expand/collapse button on mobile for long messages */}
          {isMobile && message.content.length > 300 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpand}
              className="self-center mt-1 text-xs text-gray-500 flex items-center gap-1 h-6"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> Read more
                </>
              )}
            </Button>
          )}
          
          <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 md:h-8 md:w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigator.clipboard.writeText(message.content)}
            >
              <Copy size={14} className="md:hidden" />
              <Copy size={16} className="hidden md:block" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 md:h-8 md:w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onToggleFeedback(message.id)}
            >
              <ThumbsUp size={14} className="md:hidden" />
              <ThumbsUp size={16} className="hidden md:block" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 md:h-8 md:w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ThumbsDown size={14} className="md:hidden" />
              <ThumbsDown size={16} className="hidden md:block" />
            </Button>
          </div>
          {isFeedbackVisible && (
            <div className="flex items-center mt-2 md:mt-4 p-2 border rounded-lg border-gray-200 dark:border-gray-700">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mr-2">Is this conversation helpful so far?</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 md:h-8 md:w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <ThumbsUp size={14} className="md:hidden" />
                <ThumbsUp size={16} className="hidden md:block" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 md:h-8 md:w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <ThumbsDown size={14} className="md:hidden" />
                <ThumbsDown size={16} className="hidden md:block" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ml-auto"
                onClick={() => onToggleFeedback(message.id)}
              >
                <X size={14} className="md:hidden" />
                <X size={16} className="hidden md:block" />
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}