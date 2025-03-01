"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Home, Layout, Compass, Menu, Smartphone, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs"
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader 
} from "@/components/ui/sheet"
import { 
  ToastProvider, 
  ToastViewport 
} from "@/components/ui/toast"

import ProfileComponent from "@/components/profilepage/profile"
import SubscriptionComponent from "@/components/profilepage/subscription"
import SettingsComponent from "@/components/profilepage/settings"

export default function ProfilePage() {
  const [bellShake, setBellShake] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteReasonDialogOpen, setDeleteReasonDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deleteReason, setDeleteReason] = useState("")

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50/50">
        {/* Mobile Navigation */}
        <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-gray-50 border-b z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/Logomark.png" alt="Learnrithm AI Logo" width={32} height={32} />
              <span className="font-semibold text-xl">Learnrithm AI</span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <>
                  <SheetHeader className="p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Image src="/images/Logomark.png" alt="Learnrithm AI Logo" width={32} height={32} />
                      <span className="font-semibold text-xl">Learnrithm AI</span>
                    </div>
                  </SheetHeader>
                  <nav className="flex-1 p-4 space-y-2">
                    <Link href="/pricing">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Home className="h-5 w-5" /> Pricing
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Layout className="h-5 w-5" /> Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-2 bg-blue-50 text-blue-600">
                      <Compass className="h-5 w-5" /> Profile
                    </Button>
                  </nav>
                </>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-card p-4 border-r hidden md:block">
          <div className="flex items-center gap-2 mb-8">
            <Image src="/images/Logomark.png" alt="Learnrithm AI Logo" width={32} height={32} />
            <span className="font-semibold text-xl">Learnrithm AI</span>
          </div>
          <nav className="space-y-2">
            <Link href="/pricing">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-5 w-5" /> Pricing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Layout className="h-5 w-5" /> Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2 bg-blue-50 text-blue-600">
              <Compass className="h-5 w-5" /> Profile
            </Button>
          </nav>
        </aside>

        {/* Main Content with adjusted left margin on desktop and top margin on mobile */}
        <div className="md:ml-64">
          <div className="container max-w-6xl mx-auto py-8 px-4 mt-20 md:mt-0">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    JD
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <p className="text-gray-500">john.doe@example.com</p>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  Pro Member
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 h-12">
                <TabsTrigger value="profile" className="text-sm">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="subscription" className="text-sm">
                  Subscription
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-sm">
                  Settings
                </TabsTrigger>
              </TabsList>

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