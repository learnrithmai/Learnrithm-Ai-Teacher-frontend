"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ToastProvider } from "../ui/toast";

interface ProviderProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
};

export default Providers;