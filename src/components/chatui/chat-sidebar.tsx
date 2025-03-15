"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MessageSquare, Plus, Search, Moon, Sun, HelpCircle, LogOut, Pin, Trash } from "lucide-react"
import Image from "next/image"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "@/components/chatui/chat-provider"
import { useSidebar } from "@/components/chatui/sidebar-provider"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export function ChatSidebar({ darkMode, setDarkMode }: ChatSidebarProps) {
  const { state, actions } = useChat()
  const { sidebarOpen } = useSidebar()
  const [searchTerm, setSearchTerm] = React.useState("")

  // Ensure state.chats exists before filtering
  const pinnedChats = React.useMemo(() => state.chats?.filter((chat) => chat.pinned) || [], [state.chats])

  const unpinnedChats = React.useMemo(() => state.chats?.filter((chat) => !chat.pinned) || [], [state.chats])

  return (
    <motion.div
      className={cn(
        "hidden md:flex border-r bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out z-10",
        sidebarOpen ? "w-[300px]" : "w-[0px]",
      )}
      initial={false}
      animate={{ width: sidebarOpen ? 300 : 0 }}
    >
      <div className="flex flex-col h-full w-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/images/Logomark.png" alt="Learnrithm AI Logo" width={32} height={32} />
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
            <Button className="w-full justify-start gap-2" onClick={() => actions.createChat("New Chat")}>
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Pinned Chats */}
          <div className="px-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Pinned Chats</h3>
            {pinnedChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg cursor-pointer group",
                  state.selectedChat === chat.id ? "bg-accent" : "hover:bg-accent/50",
                )}
                onClick={() => actions.setSelectedChat(chat.id)}
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
                      e.stopPropagation()
                      actions.togglePin(chat.id)
                    }}
                  >
                    <Pin className="h-3 w-3 fill-current" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      actions.deleteChat(chat.id)
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
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Chats</h3>
            {unpinnedChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg cursor-pointer group",
                  state.selectedChat === chat.id ? "bg-accent" : "hover:bg-accent/50",
                )}
                onClick={() => actions.setSelectedChat(chat.id)}
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
                      e.stopPropagation()
                      actions.togglePin(chat.id)
                    }}
                  >
                    <Pin className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      actions.deleteChat(chat.id)
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
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setDarkMode(!darkMode)}>
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
            Help & FAQ
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

