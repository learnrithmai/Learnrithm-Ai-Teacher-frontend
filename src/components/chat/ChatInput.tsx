"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Send } from "lucide-react";
import { FilePreview, Mode } from "@/types/chat";

interface ChatInputProps {
  input: string;
  filePreview: FilePreview[];
  activeMode: string | null;
  modes: Mode[];
  onInputChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileId: string) => void;
  onSend: () => void;
  onModeSelect: (mode: string) => void;
}

export function ChatInput({ 
  input, 
  filePreview, 
  activeMode, 
  modes, 
  onInputChange, 
  onFileChange, 
  onRemoveFile, 
  onSend, 
  onModeSelect 
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="max-w-3xl mx-auto relative">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={onFileChange}
          multiple
        />
        {filePreview.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {filePreview.map(file => (
              <div 
                key={file.id} 
                className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-sm"
              >
                <span className="truncate max-w-xs">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => onRemoveFile(file.id)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="relative flex items-center rounded-full border border-gray-300 bg-white">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full text-gray-500 hover:text-gray-700 ml-1"
            onClick={handleFileUpload}
            title="Upload files or images"
          >
            <Upload size={16} />
          </Button>
          <Input
            placeholder="Ask anything"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black placeholder-gray-500 bg-transparent"
            style={{ paddingTop: "12px", paddingBottom: "12px", minHeight: "48px" }}
          />
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-black text-white hover:bg-gray-800 mr-2"
            onClick={onSend}
          >
            <Send size={16} />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant="outline"
                size="sm"
                className={`rounded-full flex items-center gap-1 text-xs border transition-colors ${
                  activeMode === mode.name 
                    ? "bg-black text-white border-black" 
                    : "bg-transparent text-gray-700 border-gray-300"
                }`}
                onClick={() => onModeSelect(mode.name)}
              >
                <Icon size={14} />
                <span>{mode.name}</span>
              </Button>
            );
          })}
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}