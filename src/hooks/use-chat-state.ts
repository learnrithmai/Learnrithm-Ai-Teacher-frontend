import * as React from "react"
import type { ChatState, Message, Chat } from "@/types"

// Simple ID generator function
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function useChatState() {
  const [state, setState] = React.useState<ChatState>({
    chats: [
      { 
        id: "1", 
        name: "New Chat", 
        pinned: false, 
        messages: [] 
      }
    ],
    selectedChat: "1",
    currentChat: null,
  });

  React.useEffect(() => {
    // Make sure currentChat is always set to the selected chat
    const current = state.chats.find(chat => chat.id === state.selectedChat);
    if (current && state.currentChat !== current) {
      setState(prev => ({ ...prev, currentChat: current }));
    }
  }, [state.selectedChat, state.chats]);

  const actions = React.useMemo(() => ({
    createChat: (name: string) => {
      const id = generateId();
      setState(prevState => {
        const newChat = { id, name, pinned: false, messages: [] }
        return {
          ...prevState,
          chats: [...prevState.chats, newChat],
          selectedChat: id,
          currentChat: newChat
        }
      })
    },

    // Rest of action functions with same implementation but using generateId() instead of uuidv4()
    
    addMessage: (message: Omit<Message, "id">) => {
      setState(prevState => {
        // Find the current chat
        const chatIndex = prevState.chats.findIndex(c => c.id === prevState.selectedChat);
        
        if (chatIndex === -1) return prevState;
        
        // Create a new message with ID
        const newMessage = {
          id: generateId(),
          ...message,
        };
        
        // Create a new array of chats with the updated messages
        const updatedChats = [...prevState.chats];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          messages: [...updatedChats[chatIndex].messages, newMessage]
        };
        
        // Update the current chat reference
        const updatedCurrentChat = updatedChats[chatIndex];
        
        return {
          ...prevState,
          chats: updatedChats,
          currentChat: updatedCurrentChat
        };
      });
    },

    // Include all other actions...
    deleteChat: (id: string) => {
      setState(prevState => {
        const filteredChats = prevState.chats.filter(chat => chat.id !== id)
        
        // If we're deleting the selected chat, select another one
        let newSelectedId = prevState.selectedChat
        if (id === prevState.selectedChat) {
          newSelectedId = filteredChats.length > 0 ? filteredChats[0].id : ""
        }
        
        const newCurrentChat = filteredChats.find(chat => chat.id === newSelectedId) || null
        
        return {
          ...prevState,
          chats: filteredChats,
          selectedChat: newSelectedId,
          currentChat: newCurrentChat
        }
      })
    },

    renameChat: (id: string, name: string) => {
      setState(prevState => {
        const updatedChats = prevState.chats.map(chat => 
          chat.id === id ? { ...chat, name } : chat
        )
        
        // Update currentChat if it's the one being renamed
        const updatedCurrentChat = 
          prevState.currentChat?.id === id 
            ? { ...prevState.currentChat, name } 
            : prevState.currentChat
        
        return {
          ...prevState,
          chats: updatedChats,
          currentChat: updatedCurrentChat
        }
      })
    },

    setSelectedChat: (id: string) => {
      setState(prevState => {
        const selectedChat = prevState.chats.find(chat => chat.id === id) || null
        return {
          ...prevState,
          selectedChat: id,
          currentChat: selectedChat
        }
      })
    },

    togglePin: (id: string) => {
      setState(prevState => {
        const updatedChats = prevState.chats.map(chat => 
          chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
        )
        
        // Update currentChat if it's the one being toggled
        const updatedCurrentChat = 
          prevState.currentChat?.id === id 
            ? { ...prevState.currentChat, pinned: !prevState.currentChat.pinned } 
            : prevState.currentChat
        
        return {
          ...prevState,
          chats: updatedChats,
          currentChat: updatedCurrentChat
        }
      })
    },

    clearMessages: (chatId: string) => {
      setState(prevState => {
        const updatedChats = prevState.chats.map(chat => 
          chat.id === chatId ? { ...chat, messages: [] } : chat
        )
        
        // Update currentChat if it's the one being cleared
        const updatedCurrentChat = 
          prevState.currentChat?.id === chatId 
            ? { ...prevState.currentChat, messages: [] } 
            : prevState.currentChat
        
        return {
          ...prevState,
          chats: updatedChats,
          currentChat: updatedCurrentChat
        }
      })
    },
  }), []);

  return [state, actions] as const;
}