"use client";

import { useState } from "react";
import { BookOpen, Brain, FileQuestion, HelpCircle } from "lucide-react";
import { Chat, Message, FilePreview, Mode } from "@/types/chat";
import { AnalysisResult } from "@/types/files"; // New import
import { groupChatsByDate } from "@/utils/dateUtils";
import { Sidebar } from "@/components/chat/Sidebar";
import { MobileSidebar } from "@/components/chat/MobileSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview[]>([]);

  const modes: Mode[] = [
    { id: "study", name: "Study", icon: BookOpen },
    { id: "reason", name: "Reason", icon: Brain },
    { id: "quiz", name: "Quiz", icon: FileQuestion },
    { id: "homework", name: "Homework Helper", icon: HelpCircle },
  ];

  const chatsByDate = groupChatsByDate(chats);

  // New handler for file analysis completion
  const handleFileAnalysisComplete = (fileId: string, analysis: AnalysisResult) => {
    // Update the file preview with analysis data - add required details property
    setFilePreview(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, analysis: { ...analysis, details: "" } } 
          : file
      )
    );
    
    // Add a system message showing the analysis result
    const analysisMessage: Message = {
      id: `analysis-${fileId}`,
      content: `📄 **File Analysis**: ${analysis.summary}`,
      role: "assistant",
      timestamp: new Date(),
      chatId: currentChatId || ''
    };
    
    setMessages(prev => [...prev, analysisMessage]);
    
    // If we have a current chat, update its messages too
    if (currentChatId) {
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, analysisMessage] } 
          : chat
      ));
    }
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: "New chat",
      timestamp: new Date(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setMessages([]);
    setCurrentChatId(newChatId);
    return newChatId;
  };

  const handleSend = async () => {
    if (!input.trim() && filePreview.length === 0) return;

    const chatId = currentChatId || createNewChat();
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      files: filePreview.length > 0 ? [...filePreview] : undefined,
      chatId
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const chatTitle = chat.messages.length === 0 && input.trim() 
          ? (input.length > 20 ? input.substring(0, 20) + '...' : input) 
          : chat.title;
        return {
          ...chat,
          title: chatTitle,
          messages: [...chat.messages, userMessage]
        };
      }
      return chat;
    }));
    
    setInput("");
    setFilePreview([]);
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a simulated AI response. In a real implementation, this would be connected to an AI service.",
        role: "assistant",
        timestamp: new Date(),
        chatId
      };
      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
      ));
      setIsLoading(false);
    }, 1000);
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setSidebarOpen(false);
    }
  };

  const toggleFeedback = (messageId: string) => {
    if (currentFeedbackId === messageId) {
      setIsFeedbackVisible(false);
      setCurrentFeedbackId(null);
    } else {
      setIsFeedbackVisible(true);
      setCurrentFeedbackId(messageId);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFilePreviews = Array.from(files).map(file => ({
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setFilePreview(prev => [...prev, ...newFilePreviews]);
      e.target.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setFilePreview(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar 
        chatsByDate={chatsByDate}
        currentChatId={currentChatId}
        onCreateNewChat={createNewChat}
        onSelectChat={selectChat}
      />
      <MobileSidebar 
        chatsByDate={chatsByDate}
        currentChatId={currentChatId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onCreateNewChat={createNewChat}
        onSelectChat={selectChat}
      />
      <main className="flex-1 flex flex-col relative">
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          currentFeedbackId={currentFeedbackId}
          isFeedbackVisible={isFeedbackVisible}
          onToggleFeedback={toggleFeedback}
        />
        <ChatInput 
          input={input}
          filePreview={filePreview}
          activeMode={activeMode}
          modes={modes}
          onInputChange={setInput}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          onSend={handleSend}
          onModeSelect={setActiveMode}
          onFileAnalysisComplete={handleFileAnalysisComplete} // New prop
        />
      </main>
    </div>
  );
}