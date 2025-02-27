"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Plane, Bot, ScrollText, Send } from "lucide-react"

interface Message {
  id: number
  content: string
  role: "user" | "assistant"
}

interface SuggestionCard {
  icon: React.ReactNode
  title: string
  subtitle: string
}

export default function Chat() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestionCards: SuggestionCard[] = [
    {
      icon: <Plane className="h-5 w-5" />,
      title: "Wanderlust Destinations 2024",
      subtitle: "Must Visit Places",
    },
    {
      icon: <Bot className="h-5 w-5" />,
      title: "AI Assistant Features",
      subtitle: "Key Capabilities",
    },
    {
      icon: <ScrollText className="h-5 w-5" />,
      title: "Design Trends 2024",
      subtitle: "Trending Now",
    },
  ]

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  useEffect(() => {
    // Initial animations
    gsap.from(".welcome-content", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })

    gsap.from(".suggestion-card", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.4,
      ease: "power3.out",
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isTyping) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      content: message,
      role: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now(),
        content:
          "I understand your message. Let me help you with that. Here's a detailed response that shows how the message bubbles look with a longer piece of text. Notice how the message bubbles maintain their shape and spacing while accommodating different lengths of content.",
        role: "assistant",
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)

      // Animate new message
      gsap.from(".message:last-child", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {messages.length === 0 ? (
          <div className="text-center space-y-6 welcome-content mb-8">
            <div className="bg-blue-600 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">How can I help you today?</h1>
              <p className="text-gray-500 max-w-md mx-auto">
                I'm your AI assistant, ready to help with any questions or tasks you have.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestionCards.map((card, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow suggestion-card bg-white border border-gray-200"
                >
                  <div className="bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center mb-3">
                    <div className="text-white">{card.icon}</div>
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-gray-900">{card.title}</h3>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-24">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("message px-4 max-w-[85%]", msg.role === "user" ? "ml-auto" : "mr-auto")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2",
                    msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900",
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message mr-auto px-4 max-w-[85%]">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="fixed bottom-6 left-4 right-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="pr-12 py-6 bg-white border-gray-200 shadow-sm rounded-xl placeholder:text-gray-400 focus-visible:ring-blue-600"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || isTyping}
                className="absolute right-2 h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

