"use client"

import type React from "react"

import { Edit2, Linkedin, Instagram, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { SocialMedia } from "./use-profile-state"

interface SocialMediaSectionProps {
  socialMedia: SocialMedia
  onEditClick: () => void
}

export default function SocialMediaSection({ socialMedia, onEditClick }: SocialMediaSectionProps) {
  return (
    <CardContent className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Social Media</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={onEditClick}
          >
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SocialMediaLink
            platform="LinkedIn"
            url={`https://linkedin.com/in/${socialMedia.linkedin}`}
            username={socialMedia.linkedin}
            icon={<Linkedin className="h-6 w-6 text-[#0077B5] mb-2" />}
            tooltipPrefix="linkedin.com/in/"
          />

          <SocialMediaLink
            platform="Instagram"
            url={`https://instagram.com/${socialMedia.instagram}`}
            username={socialMedia.instagram}
            icon={<Instagram className="h-6 w-6 text-[#E1306C] mb-2" />}
            tooltipPrefix="instagram.com/"
          />

          <SocialMediaLink
            platform="Facebook"
            url={`https://facebook.com/${socialMedia.facebook}`}
            username={socialMedia.facebook}
            icon={<Facebook className="h-6 w-6 text-[#1877F2] mb-2" />}
            tooltipPrefix="facebook.com/"
          />

          <SocialMediaLink
            platform="X (Twitter)"
            url={`https://x.com/${socialMedia.x}`}
            username={socialMedia.x}
            icon={<Twitter className="h-6 w-6 text-[#1DA1F2] mb-2" />}
            tooltipPrefix="x.com/"
          />
        </div>
      </div>
    </CardContent>
  )
}

interface SocialMediaLinkProps {
  platform: string
  url: string
  username: string
  icon: React.ReactNode
  tooltipPrefix: string
}

function SocialMediaLink({ platform, url, username, icon, tooltipPrefix }: SocialMediaLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {icon}
            <span className="text-sm text-gray-600 truncate max-w-full">{platform}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {tooltipPrefix}
            {username}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

