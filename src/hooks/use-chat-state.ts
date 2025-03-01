"use client"

import * as React from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  file?: File
}

interface Chat {
  id: string
  name: string
  messages: Message[]
  pinned: boolean
}

interface ChatState {
  chats: Chat[]
  currentChat: Chat | null
  selectedChat: string | null
}

export function useChatState(initialState: Partial<ChatState> = {}) {
  const [state, setState] = React.useState<ChatState>(() => ({
    chats: [],
    currentChat: null,
    selectedChat: null,
    ...initialState,
  }))

  const actions = React.useMemo(
    () => ({
      setCurrentChat: (chat: Chat | null) => {
        setState((prev) => {
          if (prev.currentChat?.id === chat?.id) return prev
          return { ...prev, currentChat: chat }
        })
      },

      setSelectedChat: (id: string | null) => {
        setState((prev) => {
          if (prev.selectedChat === id) return prev
          const chat = prev.chats.find((c) => c.id === id) || null
          return {
            ...prev,
            selectedChat: id,
            currentChat: chat,
          }
        })
      },

      addMessage: (message: Omit<Message, "id">) => {
        setState((prev) => {
          if (!prev.currentChat) return prev

          const newMessage = {
            ...message,
            id: Math.random().toString(),
          }

          const updatedChat = {
            ...prev.currentChat,
            messages: [...prev.currentChat.messages, newMessage],
          }

          return {
            ...prev,
            chats: prev.chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)),
            currentChat: updatedChat,
          }
        })
      },

      createChat: (name: string) => {
        setState((prev) => {
          const existingChat = prev.chats.find((chat) => chat.name === name)
          if (existingChat) {
            return {
              ...prev,
              currentChat: existingChat,
              selectedChat: existingChat.id,
            }
          }

          const newChat: Chat = {
            id: Math.random().toString(),
            name,
            messages: [],
            pinned: false,
          }
          return {
            ...prev,
            chats: [...prev.chats, newChat],
            currentChat: newChat,
            selectedChat: newChat.id,
          }
        })
      },

      togglePin: (id: string) => {
        setState((prev) => ({
          ...prev,
          chats: prev.chats.map((chat) => (chat.id === id ? { ...chat, pinned: !chat.pinned } : chat)),
        }))
      },

      deleteChat: (id: string) => {
        setState((prev) => {
          const updatedChats = prev.chats.filter((chat) => chat.id !== id)
          return {
            ...prev,
            chats: updatedChats,
            currentChat: prev.currentChat?.id === id ? null : prev.currentChat,
            selectedChat: prev.selectedChat === id ? null : prev.selectedChat,
          }
        })
      },
    }),
    [],
  )

  return [state, actions] as const
}

