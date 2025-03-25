"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Settings, Share2, LogOut } from "lucide-react";
import { ChatsByDate } from "@/types/chat";
import Image from "next/image";
import logoImage from "./logo.png";

interface SidebarProps {
  chatsByDate: ChatsByDate;
  currentChatId: string | null;
  onCreateNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

export function Sidebar({ chatsByDate, currentChatId, onCreateNewChat, onSelectChat }: SidebarProps) {
  return (
    <div className="hidden md:flex h-full w-[260px] flex-col bg-gray-50 border-r border-gray-200">
      <div className="p-4 flex justify-center items-center">
        <Image 
          src={logoImage} 
          alt="Learnrithm Logo" 
          width={144}
          height={36}
          className="h-9 w-auto"
          priority
        />
      </div>

      <div className="px-3 pb-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 bg-white hover:bg-gray-50"
          onClick={onCreateNewChat}
        >
          <Plus size={16} />
          New chat
        </Button>
      </div>

      <nav className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-2">
          <div className="space-y-2 py-2">
            <div className="px-3 py-2 opacity-70">
              <p className="text-sm font-medium">All chats</p>
            </div>
            <Separator className="my-1" />
            
            {Object.keys(chatsByDate).map((dateLabel) => (
              <div key={dateLabel} className="mt-4">
                <div className="px-3 py-1">
                  <p className="text-xs text-gray-500">{dateLabel}</p>
                </div>
                <div className="mt-1 space-y-1">
                  {chatsByDate[dateLabel].map((chat) => (
                    <Button
                      key={chat.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-left font-normal h-auto py-2 ${
                        currentChatId === chat.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <span className="truncate">{chat.title || "New chat"}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(chatsByDate).length === 0 && (
              <>
                <div className="mt-4">
                  <div className="px-3 py-1">
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left font-normal bg-gray-100 h-auto py-2"
                  >
                    <span className="truncate">UI Breakdown</span>
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="px-3 py-1">
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left font-normal h-auto py-2"
                  >
                    <span className="truncate">Previous chat</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start mb-2 text-left font-normal"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between items-center text-left font-normal"
            >
              <div className="flex items-center">
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
                <span>User Account</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}