"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Home, Layout, Compass, Menu, Check, Mail, Clock, Crown, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetTrigger, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ProfileComponent from "@/components/profilepage/profile"
import SubscriptionComponent from "@/components/profilepage/subscription"
import SettingsComponent from "@/components/profilepage/settings"

export default function ProfilePage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setProfileImageUrl(imageUrl)
      setUploadImageDialogOpen(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50/50">
        {/* Mobile Navigation */}
        <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-white border-b z-50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=32&width=32" alt="Learnrithm AI Logo" width={32} height={32} />
              <span className="font-semibold text-xl">Learnrithm AI</span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <>
                  <SheetHeader className="p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Learnrithm AI Logo"
                        width={32}
                        height={32}
                      />
                      <span className="font-semibold text-xl">Learnrithm AI</span>
                    </div>
                  </SheetHeader>
                  <nav className="flex-1 p-4 space-y-1.5">
                    <Link href="/pricing">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 py-2 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                      >
                        <Home className="h-5 w-5" /> Pricing
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 py-2 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                      >
                        <Layout className="h-5 w-5" /> Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 px-3 py-2 h-auto bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium border-l-2 border-blue-600"
                    >
                      <Compass className="h-5 w-5" /> Profile
                    </Button>
                  </nav>
                </>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white p-4 border-r hidden md:block shadow-sm">
          <div className="flex items-center gap-2 mb-8 px-2">
            <Image src="/placeholder.svg?height=32&width=32" alt="Learnrithm AI Logo" width={32} height={32} />
            <span className="font-semibold text-xl">Learnrithm AI</span>
          </div>
          <nav className="space-y-1.5">
            <Link href="/pricing">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-3 py-2 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
              >
                <Home className="h-5 w-5" /> Pricing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-3 py-2 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
              >
                <Layout className="h-5 w-5" /> Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-3 py-2 h-auto bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium border-l-2 border-blue-600"
            >
              <Compass className="h-5 w-5" /> Profile
            </Button>
          </nav>
        </aside>

        {/* Upload Profile Image Dialog */}

        {/* Main Content with adjusted left margin on desktop and top margin on mobile */}
        <div className="md:ml-64">
          <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 mt-20 md:mt-0">
            {/* Enhanced Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 sm:gap-5 mb-4 md:mb-0">
                  {/* Profile Image Section */}
                  <div className="relative">
                    <Dialog open={uploadImageDialogOpen} onOpenChange={setUploadImageDialogOpen}>
                      <DialogTrigger asChild>
                        <button className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md overflow-hidden group cursor-pointer">
                          {profileImageUrl ? (
                            <Image
                              src={profileImageUrl || "/placeholder.svg"}
                              alt="Profile"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            "JD"
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                            <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <div className="py-6 flex flex-col items-center justify-center">
                          <div
                            className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={triggerFileInput}
                          >
                            <Camera className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to browse</p>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                          />
                          <p className="text-xs text-gray-500 mt-4">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">John Doe</h1>
                    <div className="flex items-center text-gray-500">
                      <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span className="text-sm">john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 text-xs sm:text-sm"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Member since Oct 2023
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white border-0 px-3 py-1.5 text-xs font-medium rounded-full shadow-sm">
                    <Crown className="h-3.5 w-3.5 mr-1.5" />
                    Pro Member
                  </Badge>
                  <span className="text-xs text-gray-500">Renewal in 230 days</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <div className="border-b">
                <div className="container max-w-6xl mx-auto px-0">
                  <TabsList className="h-12 bg-transparent w-auto ml-0 mr-auto space-x-2">
                    <TabsTrigger
                      value="profile"
                      className="text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none px-4 rounded-t-lg"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="subscription"
                      className="text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none px-4 rounded-t-lg"
                    >
                      Subscription
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none px-4 rounded-t-lg"
                    >
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <ProfileComponent />
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription">
                <SubscriptionComponent />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <SettingsComponent />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[60]">
            {Array.from({ length: Math.min(window.innerWidth < 640 ? 50 : 100, 100) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  top: "50%",
                  left: "50%",
                  width: Math.random() * (window.innerWidth < 640 ? 6 : 10) + 5,
                  height: Math.random() * (window.innerWidth < 640 ? 6 : 10) + 5,
                  backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"][
                    Math.floor(Math.random() * 6)
                  ],
                  borderRadius: "50%",
                }}
                animate={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 3,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </div>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-[420px] sm:max-w-[440px] z-[100]" />
    </ToastProvider>
  )
}