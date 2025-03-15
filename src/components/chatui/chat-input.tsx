"use client";

import * as React from "react";
import {
  Plus,
  Mic,
  Brain,
  BookOpen,
  ClipboardCheck,
  Microscope,
  Code,
  PenTool,
  X,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileUpload } from "./file-upload";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useChat } from "@/components/chatui/chat-provider";

export function ChatInput() {
  const [input, setInput] = React.useState("");
  const [activePill, setActivePill] = React.useState<string | null>(null);
  const { files, addFiles, removeFile } = useFileUpload();
  const { actions } = useChat();

  const handleSend = React.useCallback(() => {
    if (!input.trim() && files.length === 0) return;

    if (files.length > 0) {
      files.forEach((file) => {
        actions.addMessage({
          role: "user",
          content: `Uploaded file: ${file.name}`,
          file,
        });
      });
    }

    if (input.trim()) {
      actions.addMessage({
        role: "user",
        content: input.trim(),
      });
    }

    console.log("Input:", input);

    setInput("");
    removeFile(0); // Clear files after sending
  }, [input, files, actions, removeFile]);

  return (
    <div className="flex flex-col gap-2">
      {/* File Bubbles */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-full bg-muted/50 group hover:bg-muted animate-in slide-in-from-bottom-2"
            >
              {file.type.startsWith("image/") ? (
                <div className="relative w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs">
                    {file.name.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs max-w-[100px] truncate">
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-center px-4">
        <div className="flex-1">
          <Input
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="rounded-2xl border-0 bg-background shadow-none text-base px-4 py-3 focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center gap-2 ml-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="end">
              <FileUpload onFileSelect={addFiles} />
            </PopoverContent>
          </Popover>

          <Button
            size="icon"
            className="rounded-full h-8 w-8 bg-black text-white hover:bg-black/90"
            onClick={handleSend}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 px-4 no-scrollbar">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0",
            activePill === "study" &&
              "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
          )}
          onClick={() => setActivePill(activePill === "study" ? null : "study")}
        >
          <BookOpen className="h-3 w-3 mr-1" />
          <span>Study Mode</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0",
            activePill === "quiz" &&
              "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
          )}
          onClick={() => setActivePill(activePill === "quiz" ? null : "quiz")}
        >
          <ClipboardCheck className="h-3 w-3 mr-1" />
          <span>Quiz</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0",
            activePill === "research" &&
              "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
          )}
          onClick={() =>
            setActivePill(activePill === "research" ? null : "research")
          }
        >
          <Microscope className="h-3 w-3 mr-1" />
          <span>Research</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0",
            activePill === "debug" &&
              "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
          )}
          onClick={() => setActivePill(activePill === "debug" ? null : "debug")}
        >
          <Code className="h-3 w-3 mr-1" />
          <span>Code Debugger</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0",
            activePill === "homework" &&
              "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
          )}
          onClick={() =>
            setActivePill(activePill === "homework" ? null : "homework")
          }
        >
          <PenTool className="h-3 w-3 mr-1" />
          <span>Homework Helper</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full h-8 px-3 text-xs font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0",
            activePill === "think" &&
              "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
          )}
          onClick={() => setActivePill(activePill === "think" ? null : "think")}
        >
          <Brain className="h-3 w-3 mr-1" />
          <span>Think</span>
        </Button>
      </div>
    </div>
  );
}
