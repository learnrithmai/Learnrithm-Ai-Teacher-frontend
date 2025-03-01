"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThumbsUp, ThumbsDown, Loader2, FileText } from "lucide-react"
import Image from "next/image"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChat } from "@/components/chatui/chat-provider"
import { cn } from "@/lib/utils"

export function ChatMessages() {
  const { state } = useChat()
  const [isLoading] = React.useState(false)

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence>
          {state.currentChat?.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={cn("flex gap-3 text-sm", message.role === "user" && "justify-end")}>
                {message.role === "assistant" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  </motion.div>
                )}
                <motion.div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%] space-y-2",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {"file" in message ? (
                    <div className="flex items-center gap-2">
                      {message.file?.type.startsWith("image/") ? (
                        <div className="relative aspect-video w-48 overflow-hidden rounded-md">
                          <Image
                            src={URL.createObjectURL(message.file) || "/placeholder.svg"}
                            alt={message.file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{message.file?.name}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 pt-2">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
                {message.role === "user" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-3"
          >
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-4 py-2">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Loader2 className="h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  )
}

