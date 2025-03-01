"use client"

import { ErrorBoundary } from "@/components/chatui/error-boundary"
import { SidebarProvider } from "@/components/chatui/sidebar-provider"
import { ChatProvider } from "@/components/chatui/chat-provider"
import { ChatLayout } from "@/components/chatui/chat-layout"

export default function ChatUI() {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <SidebarProvider>
          <ChatLayout />
        </SidebarProvider>
      </ChatProvider>
    </ErrorBoundary>
  )
}

