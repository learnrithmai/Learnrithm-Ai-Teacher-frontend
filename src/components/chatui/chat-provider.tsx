"use client"

import * as React from "react"
import type { ChatState } from "@/types"
import { useChatState } from "@/hooks/use-chat-state"

interface ChatContextValue {
  state: ChatState
  actions: ReturnType<typeof useChatState>[1]
}

const ChatContext = React.createContext<ChatContextValue | null>(null)

export function useChat() {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, actions] = useChatState()

  const value = React.useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

