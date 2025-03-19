"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, MessageSquare, Plus, Settings } from "lucide-react";
import { ChatsByDate } from "@/types/chat";

interface MobileSidebarProps {
  chatsByDate: ChatsByDate;
  currentChatId: string | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onCreateNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

export function MobileSidebar({ 
  chatsByDate, 
  currentChatId, 
  sidebarOpen, 
  setSidebarOpen, 
  onCreateNewChat, 
  onSelectChat 
}: MobileSidebarProps) {
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute left-4 top-4 text-black z-10"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-0 bg-white border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-white text-black border-gray-300 hover:bg-gray-50"
              onClick={() => {
                onCreateNewChat();
                setSidebarOpen(false);
              }}
            >
              <Plus size={16} />
              New chat
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-2">
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <MessageSquare className="h-4 w-4" />
                  All Chats
                </Button>
              </div>
              
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
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(chatsByDate).length === 0 && (
                <div>
                  <div className="text-xs text-gray-500 font-medium px-2 py-1">Today</div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group text-gray-700 hover:bg-gray-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} />
                      <span className="truncate text-sm">Hi there summary</span>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-2 border-t border-gray-200">
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-200">
              <Settings size={16} />
              Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}