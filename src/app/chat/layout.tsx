import { ChatLayout } from "@/components/chatui/chat-layout";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learnrithm | Chat",
  description: "Chat with our AI assistant",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatLayout>{children}</ChatLayout>;
}
