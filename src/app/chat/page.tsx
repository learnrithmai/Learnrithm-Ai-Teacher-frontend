"use client";

import { useState, useEffect } from "react";
import { BookOpen, Brain, FileQuestion, HelpCircle } from "lucide-react";
import { Chat, Message, FilePreview, Mode } from "@/types/chat";
import { AnalysisResult } from "@/types/files";
import { groupChatsByDate } from "@/utils/dateUtils";
import { Sidebar } from "@/components/chat/Sidebar";
import { MobileSidebar } from "@/components/chat/MobileSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { v4 as uuidv4 } from "uuid"; // You'll need to install this: npm install uuid

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string>("study"); // Default mode is study
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview[]>([]);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [userId, setUserId] = useState<string>(""); // Add userId state

  // Initialize or get userId on component mount
  useEffect(() => {
    // Get existing or generate new anonymous user ID
    const storedUserId = localStorage.getItem('anonymousUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4(); // Generate UUID
      localStorage.setItem('anonymousUserId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const modes: Mode[] = [
    { id: "study", name: "Study", icon: BookOpen },
    { id: "reason", name: "Reason", icon: Brain },
    { id: "quiz", name: "Quiz", icon: FileQuestion },
    { id: "homeworkhelper", name: "Homework Helper", icon: HelpCircle },
  ];

  const chatsByDate = groupChatsByDate(chats);

  // Handle file analysis completion
  const handleFileAnalysisComplete = (fileId: string, analysis: { summary: string; content?: string }) => {
    setFilePreview(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, analysis: { summary: analysis.summary, details: analysis.content || "" } } 
          : file
      )
    );
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

  // Process files with user prompt - updated to include userId tracking
  const processFilesWithPrompt = async (files: FilePreview[], prompt: string, mode: string) => {
    setIsLoading(true);
    
    try {
      // Find the actual file objects that match the previews
      const actualFiles = currentFiles.filter(file => 
        files.some(preview => preview.name === file.name)
      );
      
      if (actualFiles.length === 0) {
        throw new Error("No files found to process");
      }
      
      const results: Array<{ filename: string } & AnalysisResult> = [];
      
      // Process each file sequentially
      for (const file of actualFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode);
        
        if (prompt) {
          // If we have a prompt, add it to guide the analysis
          formData.append('prompt', prompt);
        }
        
        // Add user ID for tracking
        formData.append('userId', userId);
        
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'x-user-id': userId // Add user ID header
          },
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze file');
        }
        
        const data = await response.json();
        
        if (data.success && data.analysisResult) {
          results.push({
            filename: file.name,
            ...data.analysisResult
          });
          
          // Update the file preview with analysis
          const matchingPreview = files.find(f => f.name === file.name);
          if (matchingPreview) {
            handleFileAnalysisComplete(matchingPreview.id, data.analysisResult);
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error("Error processing files:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && filePreview.length === 0) return;

    const chatId = currentChatId || createNewChat();
    const hasFiles = filePreview.length > 0;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input || (hasFiles ? "Please analyze these files" : ""),
      role: "user",
      timestamp: new Date(),
      files: hasFiles ? [...filePreview] : undefined,
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
    setIsLoading(true);

    try {
      let aiResponse = "";
      
      // If there are files, process them with the user's prompt
      if (hasFiles) {
        const fileResults = await processFilesWithPrompt(
          filePreview,
          input, // User's prompt/instructions for the file analysis
          activeMode
        );
        
        // Combine results into a single response
        if (fileResults && fileResults.length > 0) {
          aiResponse = fileResults.map(result => {
            return `**Analysis of ${result.filename}:**\n\n${result.summary}`;
          }).join("\n\n");
        } else {
          aiResponse = "I couldn't analyze the files. Please try again with different files or instructions.";
        }
        
        // Clear the file previews after processing
        setFilePreview([]);
        setCurrentFiles([]);
      } 
      // Otherwise, handle as a regular chat message
      else {
        // Format messages for API request
        const apiMessages = updatedMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Call the API with the selected mode and user ID for tracking
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId // Add user ID to headers for tracking
          },
          body: JSON.stringify({
            messages: apiMessages,
            mode: activeMode,
            max_tokens: 1500,
            userId: userId // Also include in body as fallback
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        aiResponse = data.content || "I couldn't generate a response. Please try again.";
      }
      
      // Create AI message from response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
        chatId
      };

      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, messages: newMessages } : chat
      ));
      
    } catch (error) {
      console.error("Error processing request:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        chatId
      };
      
      setMessages([...updatedMessages, errorMessage]);
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, messages: [...chat.messages, errorMessage] } : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setSidebarOpen(false);
      // Clear file previews when switching chats
      setFilePreview([]);
      setCurrentFiles([]);
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
      // Store actual file objects
      setCurrentFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
      
      // Create preview objects
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
    // Get the file name before removing it
    const fileToRemove = filePreview.find(file => file.id === fileId);
    
    // Remove from preview
    setFilePreview(prev => prev.filter(file => file.id !== fileId));
    
    // Remove the actual file
    if (fileToRemove) {
      setCurrentFiles(prev => prev.filter(file => file.name !== fileToRemove.name));
    }
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
          onFileAnalysisComplete={handleFileAnalysisComplete}
        />
      </main>
    </div>
  );
}