"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link" // <-- Import Link for navigation
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Eye,
  EyeOff,
  Home,
  Layout,
  Compass,
  Menu,
  Check,
  Smartphone,
  Laptop,
  Globe,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [activeSessionsOpen, setActiveSessionsOpen] = useState(false)
  const [twoFactorOpen, setTwoFactorOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [showToast, setShowToast] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteReasonDialogOpen, setDeleteReasonDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [billingDialogOpen, setBillingDialogOpen] = useState(false)
  const [billingEmail, setBillingEmail] = useState("john.doe@example.com")
  const [showConfetti, setShowConfetti] = useState(false)
  const [bellShake, setBellShake] = useState(false)
  const { toast } = useToast()

  const subscriptionData = {
    plan: "Pro Plan",
    startDate: "Oct 15, 2023",
    endDate: "Oct 15, 2024",
    daysLeft: 230,
    percentLeft: 63,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    // Handle password update
    console.log("Password updated")
  }

  const activeSessions = [
    {
      device: "iPhone 13",
      browser: "Safari",
      location: "New York, USA",
      lastActive: "Just now",
      current: true,
      icon: Smartphone,
    },
    {
      device: "MacBook Pro",
      browser: "Chrome",
      location: "New York, USA",
      lastActive: "2 hours ago",
      current: false,
      icon: Laptop,
    },
    {
      device: "Windows PC",
      browser: "Firefox",
      location: "Boston, USA",
      lastActive: "Yesterday",
      current: false,
      icon: Laptop,
    },
  ]

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Arabic",
    "Portuguese",
    "Italian",
    "Dutch",
    "Swedish",
    "Norwegian",
    "Finnish",
    "Danish",
    "Polish",
    "Turkish",
    "Hindi",
    "Bengali",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Greek",
  ]

  const handleBellClick = () => {
    setBellShake(true)
    setTimeout(() => setBellShake(false), 500)
    toast({
      title: "Subscription Reminder Set",
      description: "You'll be notified by email when your subscription is about to end.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const showConfettiEffect = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

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
                    <SheetTitle>
                      <div className="flex items-center gap-2">
                        <Image src="/images/Logomark.png" alt="Learnrithm AI Logo" width={32} height={32} />
                        <span className="font-semibold text-xl">Learnrithm AI</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Home className="h-5 w-5" /> Pricing
                    </Button>
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
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-5 w-5" /> Pricing
            </Button>
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
                  <Avatar className="h-16 w-16 border-2 border-[#1877F2]">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">John Doe</h1>
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

              <TabsContent value="profile">
                <div className="grid gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your personal details and settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-gray-900">John Doe</p>
                          <Separator />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">john.doe@example.com</p>
                          <Separator />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-gray-500">Location</label>
                          <p className="text-gray-900">New York, USA</p>
                          <Separator />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="password">Create New Password</Label>
                              <div className="relative">
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="pr-10"
                                  placeholder="Enter new password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <div className="relative">
                                <Input
                                  id="confirmPassword"
                                  type={showConfirmPassword ? "text" : "password"}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="pr-10"
                                  placeholder="Confirm new password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Button type="submit" className="bg-[#1877F2] hover:bg-[#1877F2]/90 w-full">
                            Update Password
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="subscription">
                <div className="grid gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Current Subscription</CardTitle>
                            <CardDescription>Your subscription details and status</CardDescription>
                          </div>
                          <Badge className="bg-[#1877F2]">{subscriptionData.plan}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Start Date</span>
                              <span className="font-medium">{subscriptionData.startDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">End Date</span>
                              <span className="font-medium">{subscriptionData.endDate}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Time Remaining</span>
                              <span className="font-medium text-[#1877F2]">{subscriptionData.daysLeft} days left</span>
                            </div>
                            <Progress value={subscriptionData.percentLeft} className="h-2" />
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <Separator />
                          <div className="rounded-lg bg-gray-50 p-4">
                            <h4 className="font-medium mb-2">Want to upgrade?</h4>
                            <p className="text-sm text-gray-500">Get access to more features with our Enterprise plan</p>
                            <Button variant="outline">View Plans</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Updated Settings Content */}
              <TabsContent value="settings">
                <div className="grid gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Manage your security and account preferences</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Security Section */}
                          <div>
                            <h3 className="font-medium text-lg mb-4">Security</h3>
                            <div className="space-y-4">
                              <Dialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen}>
                                <DialogTrigger asChild>
                                  <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                      <p className="font-medium text-gray-900">Two-factor Authentication</p>
                                      <p className="text-sm text-gray-500">
                                        Add an extra layer of security to your account
                                      </p>
                                    </div>
                                    <Button variant="outline">Enable</Button>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Two-factor Authentication</DialogTitle>
                                    <DialogDescription>Add an extra layer of security to your account</DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4 space-y-6">
                                    <div className="flex items-center space-x-4">
                                      <div className="bg-blue-100 p-3 rounded-full">
                                        <Smartphone className="h-6 w-6 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-medium">Authenticator App</h4>
                                        <p className="text-sm text-gray-500">
                                          Use an authenticator app like Google Authenticator or Authy
                                        </p>
                                      </div>
                                      <Button variant="outline" size="sm">
                                        Set up
                                      </Button>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                      <div className="bg-blue-100 p-3 rounded-full">
                                        <Smartphone className="h-6 w-6 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-medium">SMS Authentication</h4>
                                        <p className="text-sm text-gray-500">Receive a code via SMS to your phone</p>
                                      </div>
                                      <Button variant="outline" size="sm">
                                        Set up
                                      </Button>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                      <div className="bg-blue-100 p-3 rounded-full">
                                        <Smartphone className="h-6 w-6 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-medium">Backup Codes</h4>
                                        <p className="text-sm text-gray-500">
                                          Generate backup codes to use when you don't have access to your device
                                        </p>
                                      </div>
                                      <Button variant="outline" size="sm">
                                        Generate
                                      </Button>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setTwoFactorOpen(false)}>
                                      Cancel
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Dialog open={activeSessionsOpen} onOpenChange={setActiveSessionsOpen}>
                                <DialogTrigger asChild>
                                  <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                      <p className="font-medium text-gray-900">Active Sessions</p>
                                      <p className="text-sm text-gray-500">
                                        Manage your active sessions and connected devices
                                      </p>
                                    </div>
                                    <Button variant="outline">View</Button>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                                  <DialogHeader className="space-y-2">
                                    <DialogTitle>Active Sessions</DialogTitle>
                                    <DialogDescription>
                                      View and manage your active sessions across devices
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4 overflow-x-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Device</TableHead>
                                          <TableHead>Location</TableHead>
                                          <TableHead>Last Active</TableHead>
                                          <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {activeSessions.map((session, index) => (
                                          <TableRow key={index}>
                                            <TableCell className="font-medium">
                                              <div className="flex items-center gap-2">
                                                <session.icon className="h-4 w-4 text-gray-500" />
                                                <div>
                                                  <p>{session.device}</p>
                                                  <p className="text-xs text-gray-500">{session.browser}</p>
                                                </div>
                                                {session.current && (
                                                  <Badge
                                                    variant="outline"
                                                    className="ml-2 bg-green-50 text-green-700 text-xs"
                                                  >
                                                    Current
                                                  </Badge>
                                                )}
                                              </div>
                                            </TableCell>
                                            <TableCell>{session.location}</TableCell>
                                            <TableCell>{session.lastActive}</TableCell>
                                            <TableCell className="text-right">
                                              {!session.current && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                  Logout
                                                </Button>
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setActiveSessionsOpen(false)}>
                                      Close
                                    </Button>
                                    <Button variant="destructive">Logout from all devices</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          <Separator />

                          {/* Account Management */}
                          <div>
                            <h3 className="font-medium text-lg mb-4">Account</h3>
                            <div className="space-y-4">
                              <Dialog open={languageOpen} onOpenChange={setLanguageOpen}>
                                <DialogTrigger asChild>
                                  <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                      <p className="font-medium text-gray-900">Language</p>
                                      <p className="text-sm text-gray-500">Select your preferred language</p>
                                    </div>
                                    <Button variant="outline">{selectedLanguage}</Button>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] w-full max-h-[90vh] overflow-hidden p-4 sm:p-6">
                                  <DialogHeader className="space-y-2">
                                    <DialogTitle>Select Language</DialogTitle>
                                    <DialogDescription>
                                      Choose your preferred language for the interface
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ScrollArea className="h-[50vh] sm:h-[300px] pr-4 -mr-4">
                                    <div className="py-4 space-y-2">
                                      {languages.map((language) => (
                                        <div
                                          key={language}
                                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                                            selectedLanguage === language ? "bg-blue-50" : ""
                                          }`}
                                          onClick={() => {
                                            setSelectedLanguage(language)
                                            setLanguageOpen(false)
                                          }}
                                          role="button"
                                          tabIndex={0}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                              setSelectedLanguage(language)
                                              setLanguageOpen(false)
                                            }
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-gray-500" />
                                            <span>{language}</span>
                                          </div>
                                          {selectedLanguage === language && (
                                            <Check className="h-4 w-4 text-blue-600" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                  <DialogFooter className="flex-col sm:flex-row gap-2">
                                    <Button 
                                      variant="outline" 
                                      className="w-full sm:w-auto"
                                      onClick={() => setLanguageOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="w-full sm:w-auto"
                                      onClick={() => setLanguageOpen(false)}
                                    >
                                      Save
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                  <p className="font-medium text-gray-900">Export Data</p>
                                  <p className="text-sm text-gray-500">Download a copy of your account data</p>
                                </div>
                                <Button variant="outline">Export</Button>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Communication Preferences */}
                          <div>
                            <h3 className="font-medium text-lg mb-4">Communication</h3>
                            <div className="space-y-4">
                              <Dialog open={billingDialogOpen} onOpenChange={setBillingDialogOpen}>
                                <DialogTrigger asChild>
                                  <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                      <p className="font-medium text-gray-900">Billing Notifications</p>
                                      <p className="text-sm text-gray-500">
                                        Get notified about subscription and billing updates
                                      </p>
                                    </div>
                                    <Button variant="outline">Configure</Button>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] w-full p-4 sm:p-6">
                                  <DialogHeader className="space-y-2">
                                    <DialogTitle>Billing Notifications</DialogTitle>
                                    <DialogDescription>
                                      Enter your email address to receive billing notifications
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4 space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="billing-email">Email Address</Label>
                                      <Input 
                                        id="billing-email" 
                                        type="email" 
                                        value={billingEmail} 
                                        onChange={(e) => setBillingEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter className="flex-col sm:flex-row gap-2">
                                    <Button 
                                      variant="outline" 
                                      className="w-full sm:w-auto"
                                      onClick={() => setBillingDialogOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="w-full sm:w-auto"
                                      onClick={() => {
                                        setBillingDialogOpen(false)
                                        showConfettiEffect()
                                        toast({
                                          title: "Billing Notifications Enabled",
                                          description:
                                            "You'll receive notifications about your billing and subscription.",
                                          action: <ToastAction altText="Close">Close</ToastAction>,
                                        })
                                      }}
                                    >
                                      Continue
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                  <p className="font-medium text-gray-900">Subscription Reminders</p>
                                  <p className="text-sm text-gray-500">Receive reminders before subscription renewal</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="flex items-center gap-2" 
                                  onClick={handleBellClick}
                                  aria-label="Configure subscription reminders"
                                >
                                  <motion.div
                                    animate={{ rotate: bellShake ? [0, -15, 15, -15, 15, -15, 15, 0] : 0 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Bell className="h-4 w-4" />
                                  </motion.div>
                                  Configure
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Danger Zone */}
                          <div>
                            <h3 className="font-medium text-lg text-red-600 mb-4">Danger Zone</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
                                <div>
                                  <p className="font-medium text-gray-900">Delete Account</p>
                                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Account
                </AlertDialogTitle>
              <AlertDialogDescription>
                <p className="mb-4">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be
                  permanently removed.
                </p>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="delete-confirm">
                    Type <span className="font-semibold">delete my account</span> to confirm:
                  </Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="border-red-200 focus:ring-red-500"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteConfirmText !== "delete my account"}
                className="bg-red-500 hover:bg-red-600"
                onClick={(e) => {
                  e.preventDefault()
                  setDeleteDialogOpen(false)
                  setDeleteReasonDialogOpen(true)
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Reason Dialog */}
        <Dialog open={deleteReasonDialogOpen} onOpenChange={setDeleteReasonDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Why are you leaving?</DialogTitle>
              <DialogDescription>
                We'd appreciate knowing why you want to delete your account. This helps us improve our service.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Please tell us why you're deleting your account..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteReasonDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDeleteReasonDialogOpen(false)
                  setDeleteConfirmationDialogOpen(true)
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Final Deletion Confirmation Dialog */}
        <Dialog open={deleteConfirmationDialogOpen} onOpenChange={setDeleteConfirmationDialogOpen}>
          <DialogContent className="sm:max-w-[500px] w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Account Deletion Request Received</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p>
                Your account deletion request has been received and will be processed. Your account and data will be
                cleared from our database in 30 days.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800">Important Notice</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Please note that all active subscriptions will be lost and not refunded. You will lose access to
                      all premium features immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                className="w-full sm:w-auto" 
                onClick={() => setDeleteConfirmationDialogOpen(false)}
              >
                I understand
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

