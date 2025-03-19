"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageSquare, Plus, Settings, Share2, MoreHorizontal } from "lucide-react";
import { ChatsByDate } from "@/types/chat";

interface SidebarProps {
  chatsByDate: ChatsByDate;
  currentChatId: string | null;
  onCreateNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

export function Sidebar({ chatsByDate, currentChatId, onCreateNewChat, onSelectChat }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-[260px] flex-col bg-gray-100 text-black border-r border-gray-200">
      <div className="p-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-white text-black border-gray-300 hover:bg-gray-50"
          onClick={onCreateNewChat}
        >
          <Plus size={16} />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-200">
              <MessageSquare className="h-4 w-4" />
              All Chats
            </Button>
          </div>
          <Separator className="bg-gray-300" />
          
          {Object.keys(chatsByDate).map((dateLabel) => (
            <div key={dateLabel}>
              <div className="text-xs text-gray-500 font-medium px-2 py-1">{dateLabel}</div>
              <div className="space-y-1">
                {chatsByDate[dateLabel].map((chat) => (
                  <Button 
                    key={chat.id}
                    variant="ghost" 
                    className={`w-full justify-between group text-gray-700 hover:bg-gray-200 ${currentChatId === chat.id ? 'bg-gray-200' : ''}`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} />
                      <span className="truncate text-sm text-left">
                        {chat.title || "New chat"}
                      </span>
                    </div>
                    <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100" />
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(chatsByDate).length === 0 && (
            <>
              <div>
                <div className="text-xs text-gray-500 font-medium px-2 py-1">Today</div>
                <Button variant="ghost" className="w-full justify-between group text-gray-700 hover:bg-gray-200 bg-gray-200">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} />
                    <span className="truncate text-sm text-left">UI Breakdown</span>
                  </div>
                  <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100" />
                </Button>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium px-2 py-1">Yesterday</div>
                <Button variant="ghost" className="w-full justify-between group text-gray-700 hover:bg-gray-200">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} />
                    <span className="truncate text-sm">Previous chat</span>
                  </div>
                  <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100" />
                </Button>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-2 space-y-2 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-200">
          <Settings size={16} />
          Settings
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-gray-700 hover:bg-gray-200">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 bg-gray-300" />
                <span className="text-sm">User Account</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
            <DropdownMenuItem className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}