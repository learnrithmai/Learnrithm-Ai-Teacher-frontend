"use client"

import * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"

// Define proper types for our chat state and messages
interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  file?: File
}

interface Chat {
  id: string
  name: string
  pinned: boolean
  messages: ChatMessage[]
}

interface ChatState {
  chats: Chat[]
  selectedChat: string | null
  currentChat: Chat | null
}

// Define the actions interface
interface ChatActions {
  addMessage: (message: Omit<ChatMessage, "id">) => void
  createChat: (name: string) => void
  setSelectedChat: (id: string) => void
  togglePin: (id: string) => void
  deleteChat: (id: string) => void
  // Add other action methods as needed
}

interface ChatContextProps {
  state: ChatState
  actions: ChatActions
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined)

interface ChatProviderProps {
  children: React.ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Create a default chat
  const defaultChatId = "default-chat"

  const [state, setState] = useState<ChatState>({
    chats: [
      {
        id: defaultChatId,
        name: "New Chat",
        pinned: false,
        messages: [],
      },
    ],
    selectedChat: defaultChatId,
    currentChat: {
      id: defaultChatId,
      name: "New Chat",
      pinned: false,
      messages: [],
    },
  })

  // Implement the addMessage action
  const addMessage = useCallback((message: Omit<ChatMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9) // Simple ID generation

    setState((prevState) => {
      if (!prevState.currentChat) return prevState

      const updatedMessage = { ...message, id }
      const updatedCurrentChat = {
        ...prevState.currentChat,
        messages: [...prevState.currentChat.messages, updatedMessage],
      }

      // Update the chat in the chats array
      const updatedChats = prevState.chats.map((chat) =>
        chat.id === updatedCurrentChat.id ? updatedCurrentChat : chat,
      )

      return {
        ...prevState,
        chats: updatedChats,
        currentChat: updatedCurrentChat,
      }
    })
  }, [])

  // Create a new chat
  const createChat = useCallback((name: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newChat = {
      id,
      name,
      pinned: false,
      messages: [],
    }

    setState((prevState) => ({
      ...prevState,
      chats: [...prevState.chats, newChat],
      selectedChat: id,
      currentChat: newChat,
    }))
  }, [])

  // Set the selected chat
  const setSelectedChat = useCallback((id: string) => {
    setState((prevState) => {
      const selectedChat = prevState.chats.find((chat) => chat.id === id) || null

      return {
        ...prevState,
        selectedChat: id,
        currentChat: selectedChat,
      }
    })
  }, [])

  // Toggle pin status of a chat
  const togglePin = useCallback((id: string) => {
    setState((prevState) => {
      const updatedChats = prevState.chats.map((chat) => (chat.id === id ? { ...chat, pinned: !chat.pinned } : chat))

      // Update currentChat if it's the one being toggled
      const updatedCurrentChat =
        prevState.currentChat && prevState.currentChat.id === id
          ? { ...prevState.currentChat, pinned: !prevState.currentChat.pinned }
          : prevState.currentChat

      return {
        ...prevState,
        chats: updatedChats,
        currentChat: updatedCurrentChat,
      }
    })
  }, [])

  // Delete a chat
  const deleteChat = useCallback((id: string) => {
    setState((prevState) => {
      const updatedChats = prevState.chats.filter((chat) => chat.id !== id)

      // If we're deleting the currently selected chat, select another one
      let newSelectedChat = prevState.selectedChat
      let newCurrentChat = prevState.currentChat

      if (prevState.selectedChat === id) {
        newSelectedChat = updatedChats.length > 0 ? updatedChats[0].id : null
        newCurrentChat = updatedChats.length > 0 ? updatedChats[0] : null
      }

      return {
        ...prevState,
        chats: updatedChats,
        selectedChat: newSelectedChat,
        currentChat: newCurrentChat,
      }
    })
  }, [])

  // Create the actions object
  const actions = React.useMemo(
    () => ({
      addMessage,
      createChat,
      setSelectedChat,
      togglePin,
      deleteChat,
    }),
    [addMessage, createChat, setSelectedChat, togglePin, deleteChat],
  )

  return <ChatContext.Provider value={{ state, actions }}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

