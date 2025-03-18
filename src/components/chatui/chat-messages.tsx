"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThumbsUp, ThumbsDown, Loader2, FileText, Copy, Check, ExternalLink, RefreshCw } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChat } from "@/components/chatui/chat-provider"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"

// Define type for code component props
interface CodeProps {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

export function ChatMessages() {
  const { state } = useChat()
  const [isLoading] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)
  const [copiedMessage, setCopiedMessage] = React.useState<string | null>(null)
  const { theme } = useTheme()
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Debug logging for message roles
  React.useEffect(() => {
    if (state.currentChat?.messages) {
      console.log("All messages:", JSON.stringify(state.currentChat.messages))
    }
  }, [state.currentChat?.messages])

  // Automatically scroll to bottom when new messages are added
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [state.currentChat?.messages])

  const copyToClipboard = (text: string, isCode = false) => {
    navigator.clipboard.writeText(text)
    if (isCode) {
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    } else {
      setCopiedMessage(text)
      setTimeout(() => setCopiedMessage(null), 2000)
    }
  }

  // Define markdown components with proper typings
  const markdownComponents = {
    code: ({ node, inline, className, children, ...props }: CodeProps) => {
      const code = String(children).replace(/\n$/, "")
      if (inline) {
        return (
          <code className="bg-muted/50 rounded px-1 py-0.5 font-mono text-sm" {...props}>
            {children}
          </code>
        )
      }
      return (
        <div className="relative my-4">
          <div className="absolute right-2 top-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 bg-background/70 hover:bg-background"
                    onClick={() => copyToClipboard(code, true)}
                  >
                    {copiedCode === code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copiedCode === code ? "Copied!" : "Copy code"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <pre className="bg-muted/30 dark:bg-muted/10 p-4 rounded-lg overflow-x-auto">
            <code className="font-mono text-sm" {...props}>
              {children}
            </code>
          </pre>
        </div>
      )
    },
    p: ({ node, children, ...props }: CodeProps) => (
      <p className="mb-3 last:mb-0 leading-relaxed" {...props}>
        {children}
      </p>
    ),

    ul: ({ node, children, ...props }: CodeProps) => (
      <ul className="list-disc ml-5 space-y-1 mb-3" {...props}>
        {children}
      </ul>
    ),

    ol: ({ node, children, ...props }: CodeProps) => (
      <ol className="list-decimal ml-5 space-y-1 mb-3" {...props}>
        {children}
      </ol>
    ),

    li: ({ node, children, ...props }: CodeProps) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),

    strong: ({ node, children, ...props }: CodeProps) => (
      <strong className="font-semibold" {...props}>
        {children}
      </strong>
    ),

    h1: ({ node, children, ...props }: CodeProps) => (
      <h1 className="text-xl font-bold mb-3 mt-4" {...props}>
        {children}
      </h1>
    ),

    h2: ({ node, children, ...props }: CodeProps) => (
      <h2 className="text-lg font-bold mb-2 mt-4" {...props}>
        {children}
      </h2>
    ),

    h3: ({ node, children, ...props }: CodeProps) => (
      <h3 className="text-md font-bold mb-2 mt-3" {...props}>
        {children}
      </h3>
    ),
  }

  // Function to check if a message should be displayed as plain text
  const isPlainTextMessage = (message: any): boolean => message.role === "system" || message.role === "assistant"

  // Function to handle message regeneration
  const handleRegenerate = (messageId: string) => {
    console.log("Regenerating message:", messageId)
    // Implement regeneration logic here
  }

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
      {/* Adjusted container for responsive breakpoints */}
      <div className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto space-y-6 px-2 sm:px-0">
        <AnimatePresence>
          {state.currentChat?.messages.map((message, index) => {
            // Debug log for each message
            console.log(`Message ${index}:`, message.role)

            // Check if message should be displayed as plain text
            const displayAsPlainText = isPlainTextMessage(message)

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="w-full px-1" // Added px-1 to prevent edge bleeding
              >
                {displayAsPlainText ? (
                  // System and assistant messages as plain text without bubble
                  <div
                    className={cn(
                      "text-foreground text-sm max-w-[95%] mx-auto py-2 px-4 group relative overflow-x-hidden",
                      message.role === "system" && "italic text-muted-foreground",
                    )}
                  >
                    {/* Add copy button for assistant messages */}
                    {message.role === "assistant" && (
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 bg-background/70 hover:bg-background"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                {copiedMessage === message.content ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedMessage === message.content ? "Copied!" : "Copy message"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>

                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 pt-2 mt-2 border-t border-border/30">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Helpful</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Not helpful</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Add regenerate button */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handleRegenerate(message.id)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Regenerate response</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                ) : (
                  // User messages with bubbles (without profile picture)
                  <div className="flex justify-end w-full"> {/* Added w-full here */}
                    <motion.div
                      className="bg-primary text-primary-foreground rounded-2xl px-5 py-4 max-w-[95%] sm:max-w-[90%] md:max-w-[80%] shadow-sm relative group block" /* Added block display */
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {/* Add copy button for user messages */}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 bg-background/70 hover:bg-background text-primary-foreground"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                {copiedMessage === message.content ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedMessage === message.content ? "Copied!" : "Copy message"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {"file" in message ? (
                        <div className="flex flex-col gap-2">
                          {message.file?.type.startsWith("image/") ? (
                            <div className="relative aspect-video w-64 overflow-hidden rounded-md">
                              <Image
                                src={URL.createObjectURL(message.file) || "/placeholder.svg"}
                                alt={message.file.name}
                                fill
                                className="object-cover cursor-pointer"
                                onClick={() => {
                                  /* Add lightbox functionality */
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 bg-background/80 rounded-lg p-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="font-medium">{message.file?.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {((message.file?.size ?? 0) / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <Button size="sm" variant="ghost" className="ml-auto">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Fixed the isLoading condition */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-3 items-start"
          >
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
            </Avatar>
            <div
              className={cn("bg-muted rounded-2xl px-5 py-4 shadow-sm", theme === "dark" ? "bg-muted/70" : "bg-muted")}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  )
}