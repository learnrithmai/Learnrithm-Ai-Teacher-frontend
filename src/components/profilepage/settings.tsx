"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Smartphone,
  Laptop,
  Globe,
  Check,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Session {
  device: string
  browser: string
  location: string
  lastActive: string
  current: boolean
  icon: React.ComponentType<{ className: string }>
}

export default function SettingsComponent() {
  const [activeSessionsOpen, setActiveSessionsOpen] = useState(false)
  const [twoFactorOpen, setTwoFactorOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [billingDialogOpen, setBillingDialogOpen] = useState(false)
  const [billingEmail, setBillingEmail] = useState("john.doe@example.com")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteReasonDialogOpen, setDeleteReasonDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [bellShake, setBellShake] = useState(false)
  const { toast } = useToast()

  const activeSessions: Session[] = [
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
    <>
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
    </>
  )
}