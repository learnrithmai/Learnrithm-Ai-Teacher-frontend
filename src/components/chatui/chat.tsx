"use client";

import { Input } from "@/components/ui/input";

import { AvatarFallback } from "@/components/ui/avatar";

import { AvatarImage } from "@/components/ui/avatar";

import { Avatar } from "@/components/ui/avatar";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  ChevronLeft,
  ChevronRight,
  Send,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  BookOpen,
  Lightbulb,
  Brain,
  Rocket,
  GraduationCap,
  PenTool,
  Code,
  Calculator,
  Moon,
  Sun,
  LogOut,
  Pin,
  Trash,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  FileText,
  MapPin,
  Mic,
  ClipboardCheck,
  Microscope,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { FileUpload } from "@/components/chatui/file-upload";
import { ErrorBoundary } from "@/components/chatui/error-boundary";
import { useChatState } from "@/hooks/use-chat-state";
import { useFileUpload } from "@/hooks/use-file-upload";
import debounce from "lodash.debounce";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput as CommandInputComponent,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/command";

const SidebarContext = React.createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
} | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Previous imports remain the same...
// Keep all the previous imports from the last version

const FloatingIcon = ({ icon: Icon, initialX, initialY, duration }: any) => {
  return (
    <motion.div
      className="absolute text-primary/10 dark:text-primary/5"
      initial={{ x: initialX, y: initialY }}
      animate={{
        y: [initialY - 20, initialY + 20, initialY - 20],
        x: [initialX - 10, initialX + 10, initialX - 10],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <Icon size={32} />
    </motion.div>
  );
};

export default function ChatUI() {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <ChatUIContent />
      </SidebarProvider>
    </ErrorBoundary>
  );
}

function ChatUIContent() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [chatState, chatActions] = useChatState();
  const {
    files,
    error: fileError,
    addFiles,
    removeFile,
    clearFiles,
  } = useFileUpload();
  const [darkMode, setDarkMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activePill, setActivePill] = useState<string | null>(null);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      clearFiles();
    };
  }, [clearFiles]);

  // Debounced search
  const debouncedSearch = React.useMemo(
    () =>
      debounce((term: string) => {
        console.log("Searching for:", term);
      }, 300),
    []
  );

  React.useEffect(() => {
    if (!searchTerm) return;
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // Memoize handlers
  const handleSendMessage = React.useCallback(
    async (message: string, files?: File[]) => {
      if (!message.trim() && (!files || files.length === 0)) return;

      try {
        setIsLoading(true);

        // Create chat if none exists
        if (!chatState.currentChat) {
          chatActions.createChat("New Chat");
        }

        // Handle files first
        if (files?.length) {
          for (const file of files) {
            chatActions.addMessage({
              role: "user",
              content: `Uploaded file: ${file.name}`,
              file,
            });
          }
        }

        // Then handle text message
        if (message.trim()) {
          chatActions.addMessage({
            role: "user",
            content: message,
          });

          // Simulate AI response
          await new Promise((resolve) => setTimeout(resolve, 1000));

          chatActions.addMessage({
            role: "assistant",
            content: "This is a simulated AI response",
          });
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [chatState.currentChat, chatActions]
  );

  const handleFileSelect = React.useCallback(
    (files: File[]) => {
      setShowUpload(false);
      handleSendMessage("", files);
    },
    [handleSendMessage]
  );

  const floatingIcons = [
    { icon: BookOpen, x: "10%", y: "20%", duration: 8 },
    { icon: Lightbulb, x: "85%", y: "15%", duration: 7 },
    { icon: Brain, x: "75%", y: "60%", duration: 9 },
    { icon: Rocket, x: "15%", y: "70%", duration: 6 },
    { icon: GraduationCap, x: "90%", y: "80%", duration: 8 },
    { icon: PenTool, x: "5%", y: "40%", duration: 7 },
    { icon: Code, x: "80%", y: "35%", duration: 9 },
    { icon: Calculator, x: "20%", y: "85%", duration: 8 },
  ];

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const togglePin = (chatId: string) => {
    //Implementation for togglePin
  };

  const deleteChat = (chatId: string) => {
    //Implementation for deleteChat
  };

  const reasons = [
    { value: "general", label: "General Chat" },
    { value: "academic", label: "Academic Writing" },
    { value: "creative", label: "Creative Writing" },
    { value: "research", label: "Research" },
  ];

  return (
    <div
      className={cn(
        "h-screen flex relative overflow-hidden",
        darkMode && "dark"
      )}
    >
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <GraduationCap className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold text-primary">EduChat AI</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((icon, index) => (
          <FloatingIcon
            key={index}
            icon={icon.icon}
            initialX={icon.x}
            initialY={icon.y}
            duration={icon.duration}
          />
        ))}
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        className={cn(
          "hidden md:flex border-r bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out z-10",
          sidebarOpen ? "w-[300px]" : "w-[0px]"
        )}
        initial={false}
        animate={{ width: sidebarOpen ? 300 : 0 }}
      >
        <div className="flex flex-col h-full w-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/Logomark.png"
                alt="Learnrithm AI Logo"
                width={32}
                height={32}
              />
              <span className="font-semibold text-xl">Learnrithm AI</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-2">
            <div className="p-2">
              <Button
                className="w-full justify-start gap-2"
                onClick={() => chatActions.createChat("New Chat")}
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>

            {/* Pinned Chats */}
            <div className="px-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Pinned Chats
              </h3>
              {chatState.chats
                .filter((chat) => chat.pinned)
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg cursor-pointer group",
                      chatState.selectedChat === chat.id
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => chatActions.setSelectedChat(chat.id)}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm truncate">{chat.name}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          chatActions.togglePin(chat.id);
                        }}
                      >
                        <Pin className="h-3 w-3 fill-current" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          chatActions.deleteChat(chat.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Recent Chats */}
            <div className="px-2 mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Recent Chats
              </h3>
              {chatState.chats
                .filter((chat) => !chat.pinned)
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg cursor-pointer group",
                      chatState.selectedChat === chat.id
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => chatActions.setSelectedChat(chat.id)}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm truncate">{chat.name}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          chatActions.togglePin(chat.id);
                        }}
                      >
                        <Pin className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          chatActions.deleteChat(chat.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </>
              )}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <HelpCircle className="h-4 w-4" />
              Help & Facts
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Toggle Sidebar Button with Animation */}
      <motion.div
        className="hidden md:block absolute z-20"
        initial={false}
        animate={{ left: sidebarOpen ? "300px" : "0px" }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mt-4 ml-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen bg-background/95 backdrop-blur-sm">
        {/* Header with Animation */}
        <motion.header
          className="h-16 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <GraduationCap className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="font-semibold">Learnrithm AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Settings className="h-5 w-5" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        {/* Chat Messages with Animation */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence>
              {chatState.currentChat?.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div
                    className={cn(
                      "flex gap-3 text-sm",
                      message.role === "user" && "justify-end"
                    )}
                  >
                    {message.role === "assistant" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
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
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                      whileHover={{ scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      {"file" in message ? (
                        <div className="flex items-center gap-2">
                          {message.file &&
                          message.file.type.startsWith("image/") ? (
                            <div className="relative aspect-video w-48 overflow-hidden rounded-md">
                              <Image
                                src={
                                  URL.createObjectURL(message.file) ||
                                  "/placeholder.svg"
                                }
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
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
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
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

        {/* Input Area with Animation */}
        <div className="border-t p-4 bg-background/95 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(input);
                    setInput("");
                  }
                }}
                className="rounded-2xl border-0 bg-background shadow-none text-base px-4 py-3 focus-visible:ring-0"
              />
              <div className="relative flex items-center">
                <div className="flex gap-2">
                  <Popover
                    open={showUpload}
                    onOpenChange={() => setShowUpload(!showUpload)}
                  >
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        <span>Add</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3">
                      <div className="space-y-4">
                        <div className="font-medium text-sm">Upload Files</div>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Documents (.pdf, .doc, .txt)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <Image
                              className="h-4 w-4 text-muted-foreground"
                              src="/placeholder.svg"
                              alt="Image Preview"
                              width={16}
                              height={16}
                            />
                            <span className="text-sm text-muted-foreground">
                              Images (.jpg, .png, .gif)
                            </span>
                          </div>
                        </div>
                        <FileUpload
                          onFileSelect={(files) => {
                            handleSendMessage("", files);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
                      activePill === "study" &&
                        "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                    )}
                    onClick={() =>
                      setActivePill(activePill === "study" ? null : "study")
                    }
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>Study Mode</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
                      activePill === "quiz" &&
                        "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                    )}
                    onClick={() =>
                      setActivePill(activePill === "quiz" ? null : "quiz")
                    }
                  >
                    <ClipboardCheck className="h-3 w-3 mr-1" />
                    <span>Quiz</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
                      activePill === "research" &&
                        "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                    )}
                    onClick={() =>
                      setActivePill(
                        activePill === "research" ? null : "research"
                      )
                    }
                  >
                    <Microscope className="h-3 w-3 mr-1" />
                    <span>Research</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
                      activePill === "debug" &&
                        "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                    )}
                    onClick={() =>
                      setActivePill(activePill === "debug" ? null : "debug")
                    }
                  >
                    <Code className="h-3 w-3 mr-1" />
                    <span>Code Debugger</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
                      activePill === "homework" &&
                        "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                    )}
                    onClick={() =>
                      setActivePill(
                        activePill === "homework" ? null : "homework"
                      )
                    }
                  >
                    <PenTool className="h-3 w-3 mr-1" />
                    <span>Homework Helper</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
                      activePill === "think" &&
                        "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                    )}
                    onClick={() =>
                      setActivePill(activePill === "think" ? null : "think")
                    }
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    <span>Think</span>
                  </Button>

                  <Popover open={showUpload} onOpenChange={setShowUpload}>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>Reason</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0">
                      <Command>
                        <CommandInputComponent placeholder="Select reason..." />
                        <CommandList>
                          <CommandEmpty>No reason found.</CommandEmpty>
                          <CommandGroup>
                            {reasons.map((reason) => (
                              <CommandItem
                                key={reason.value}
                                value={reason.value}
                                onSelect={() => {
                                  // Handle reason selection
                                }}
                              >
                                {reason.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="absolute right-0">
                  <Button
                    size="icon"
                    className="rounded-full w-8 h-8 bg-black text-white hover:bg-black/90"
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep the Sidebar and ChatItem components from the previous version...
// Copy the Sidebar and ChatItem component code from the previous version
interface Chat {
  id: string;
  name: string;
  messages: Message[];
  pinned: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  file?: File;
}

function Sidebar({
  chats,
  selectedChat,
  setSelectedChat,
  togglePin,
  deleteChat,
  darkMode,
  setDarkMode,
}: {
  chats: Chat[];
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
  togglePin: (id: string) => void;
  deleteChat: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}) {
  const { sidebarOpen } = useSidebar();
  // Rest of the Sidebar component code...
}

function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (message: string, files?: File[]) => void;
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const handleFileSelect = (selectedFiles: FileList) => {
    setFiles([...Array.from(selectedFiles)]);
  };

  return (
    <div className="flex items-center gap-2">
      <FileUpload
        onFileSelect={(files) => handleFileSelect(files as unknown as FileList)}
        className="rounded-lg border bg-background p-4"
      />
      <Input
        placeholder="Ask anything about learning..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend(input, files);
            setInput("");
            setFiles([]);
          }
        }}
        className="flex-1"
      />
      <Button
        onClick={() => onSend(input, files)}
        disabled={(!input.trim() && files.length === 0) || isLoading}
        className="relative overflow-hidden"
      >
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="send"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Send className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
