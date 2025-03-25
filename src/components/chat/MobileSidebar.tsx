"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Menu, Plus, Settings } from "lucide-react";
import { ChatsByDate } from "@/types/chat";
import Image from "next/image";
import logoImage from "./logo.png";

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
  onSelectChat,
}: MobileSidebarProps) {
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute left-4 top-4 z-10"
        >
          <Menu size={24} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[260px] p-0 border-r"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-center items-center border-b">
            <Image 
              src={logoImage} 
              alt="Learnrithm Logo" 
              width={144}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </div>

          <div className="p-3 border-b">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => {
                onCreateNewChat();
                setSidebarOpen(false);
              }}
            >
              <Plus size={16} />
              New chat
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-4">
                <div>
                  <p className="px-2 py-1 text-sm font-medium text-gray-700">All chats</p>
                  <Separator className="my-1" />
                </div>
                
                {Object.keys(chatsByDate).map((dateLabel) => (
                  <div key={dateLabel}>
                    <p className="px-2 py-1 text-xs text-gray-500">{dateLabel}</p>
                    <div className="mt-1 space-y-1">
                      {chatsByDate[dateLabel].map((chat) => (
                        <Button
                          key={chat.id}
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-left font-normal h-auto py-2 ${
                            currentChatId === chat.id ? "bg-gray-100" : ""
                          }`}
                          onClick={() => {
                            onSelectChat(chat.id);
                            setSidebarOpen(false);
                          }}
                        >
                          <span className="truncate">{chat.title || "New chat"}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {Object.keys(chatsByDate).length === 0 && (
                  <div>
                    <p className="px-2 py-1 text-xs text-gray-500">Today</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left font-normal h-auto py-2"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="truncate">Hi there summary</span>
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left font-normal"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}