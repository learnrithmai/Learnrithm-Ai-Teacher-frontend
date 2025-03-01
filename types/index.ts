export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  file?: File
}

export interface Chat {
  id: string
  name: string
  messages: Message[]
  pinned: boolean
}

export interface ChatState {
  chats: Chat[]
  currentChat: Chat | null
  selectedChat: string | null
}

export interface FileWithPreview extends File {
  preview?: string
}

