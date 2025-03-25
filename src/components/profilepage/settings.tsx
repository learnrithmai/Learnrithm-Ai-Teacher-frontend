"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, Globe, Check, AlertTriangle, Moon, Sun, Trash2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsComponent() {
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
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("system")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [themeChanged, setThemeChanged] = useState(false)
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)
  const [dataExportDialogOpen, setDataExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("json")
  const [exportInProgress, setExportInProgress] = useState(false)

  const { toast } = useToast()

  // Check if theme settings have changed
  useEffect(() => {
    const originalTheme = "system"
    const originalColor = "blue"

    setThemeChanged(selectedTheme !== originalTheme || selectedColor !== originalColor)
  }, [selectedTheme, selectedColor])

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

  const colorOptions = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" },
    { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
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

  const handleThemeSubmit = () => {
    setThemeDialogOpen(false)
    toast({
      title: "Theme Settings Updated",
      description: `Theme set to ${selectedTheme} with ${selectedColor} accent color.`,
    })
  }

  const handleExportData = () => {
    setExportInProgress(true)

    // Simulate export process
    setTimeout(() => {
      setExportInProgress(false)
      setDataExportDialogOpen(false)

      toast({
        title: "Data Export Complete",
        description: `Your data has been exported in ${exportFormat.toUpperCase()} format.`,
      })
    }, 2000)
  }

  return (
    <>
      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
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
                          <Tabs defaultValue="app">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="app">Authenticator App</TabsTrigger>
                              <TabsTrigger value="sms">SMS</TabsTrigger>
                            </TabsList>
                            <TabsContent value="app" className="space-y-4 pt-4">
                              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
                                <div className="w-40 h-40 bg-white p-2 rounded-lg border mb-4">
                                  {/* This would be a QR code in a real app */}
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Lock className="h-10 w-10 text-gray-400" />
                                  </div>
                                </div>
                                <p className="text-sm text-center text-gray-500 mb-2">
                                  Scan this QR code with your authenticator app
                                </p>
                                <div className="flex items-center gap-2">
                                  <Input value="ABCD-EFGH-IJKL-MNOP" readOnly className="text-center font-mono" />
                                  <Button variant="outline" size="icon" className="flex-shrink-0">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-copy"
                                    >
                                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="verification-code">Enter verification code</Label>
                                <Input id="verification-code" placeholder="Enter 6-digit code" maxLength={6} />
                              </div>
                            </TabsContent>
                            <TabsContent value="sms" className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="phone-number">Phone Number</Label>
                                <Input id="phone-number" placeholder="+1 (555) 123-4567" />
                                <p className="text-xs text-gray-500">We&apos;ll send a verification code to this number</p>
                              </div>

                              <Button className="w-full">Send Verification Code</Button>
                            </TabsContent>
                          </Tabs>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setTwoFactorOpen(false)}>
                            Cancel
                          </Button>
                          <Button>Enable 2FA</Button>
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
                          <DialogDescription>Choose your preferred language for the interface</DialogDescription>
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
                                {selectedLanguage === language && <Check className="h-4 w-4 text-blue-600" />}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setLanguageOpen(false)}>
                            Cancel
                          </Button>
                          <Button className="w-full sm:w-auto" onClick={() => setLanguageOpen(false)}>
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <p className="font-medium text-gray-900">Theme Settings</p>
                            <p className="text-sm text-gray-500">Customize the appearance of the application</p>
                          </div>
                          <Button variant="outline">Customize</Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Theme Settings</DialogTitle>
                          <DialogDescription>Customize the appearance of the application</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <Label>Theme Mode</Label>
                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                variant={selectedTheme === "light" ? "default" : "outline"}
                                className="justify-start gap-2"
                                onClick={() => setSelectedTheme("light")}
                              >
                                <Sun className="h-4 w-4" />
                                Light
                              </Button>
                              <Button
                                variant={selectedTheme === "dark" ? "default" : "outline"}
                                className="justify-start gap-2"
                                onClick={() => setSelectedTheme("dark")}
                              >
                                <Moon className="h-4 w-4" />
                                Dark
                              </Button>
                              <Button
                                variant={selectedTheme === "system" ? "default" : "outline"}
                                className="justify-start gap-2"
                                onClick={() => setSelectedTheme("system")}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-laptop"
                                >
                                  <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
                                </svg>
                                System
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Accent Color</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {colorOptions.map((color) => (
                                <Button
                                  key={color.value}
                                  variant="outline"
                                  className={`h-10 ${selectedColor === color.value ? "ring-2 ring-offset-2" : ""}`}
                                  onClick={() => setSelectedColor(color.value)}
                                >
                                  <span className={`w-5 h-5 rounded-full ${color.class} mr-2`}></span>
                                  <span className="text-xs">{color.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue placeholder="Select font size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setThemeDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleThemeSubmit} disabled={!themeChanged}>
                            {themeChanged ? "Save Changes" : "No Changes"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={dataExportDialogOpen} onOpenChange={setDataExportDialogOpen}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <p className="font-medium text-gray-900">Export Data</p>
                            <p className="text-sm text-gray-500">Download a copy of your account data</p>
                          </div>
                          <Button variant="outline">Export</Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Export Your Data</DialogTitle>
                          <DialogDescription>
                            Download a copy of your personal data in your preferred format
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="export-format">Export Format</Label>
                            <Select value={exportFormat} onValueChange={setExportFormat}>
                              <SelectTrigger id="export-format">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="xml">XML</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Data to Export</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  id="export-profile"
                                  className="rounded border-gray-300"
                                  defaultChecked
                                />
                                <Label htmlFor="export-profile" className="text-sm font-normal">
                                  Profile Information
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  id="export-activity"
                                  className="rounded border-gray-300"
                                  defaultChecked
                                />
                                <Label htmlFor="export-activity" className="text-sm font-normal">
                                  Activity History
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  id="export-subscription"
                                  className="rounded border-gray-300"
                                  defaultChecked
                                />
                                <Label htmlFor="export-subscription" className="text-sm font-normal">
                                  Subscription Data
                                </Label>
                              </div>
                            </div>
                          </div>

                          {exportInProgress && (
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-md flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Preparing your data for export...</span>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDataExportDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleExportData} disabled={exportInProgress}>
                            {exportInProgress ? "Exporting..." : "Export Data"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <p className="font-medium text-gray-900">Privacy Settings</p>
                            <p className="text-sm text-gray-500">Manage how your data is used</p>
                          </div>
                          <Button variant="outline">Configure</Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Privacy Settings</DialogTitle>
                          <DialogDescription>Control how your information is used and shared</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-6">
                          <div className="space-y-4">
                            <h4 className="font-medium">Data Usage</h4>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="analytics" className="text-sm">
                                  Analytics
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Allow us to collect anonymous usage data to improve our service
                                </p>
                              </div>
                              <Switch id="analytics" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="personalization" className="text-sm">
                                  Personalization
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Allow us to personalize your experience based on your activity
                                </p>
                              </div>
                              <Switch id="personalization" defaultChecked />
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h4 className="font-medium">Communication Preferences</h4>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="email-notifications" className="text-sm">
                                  Email Notifications
                                </Label>
                                <p className="text-xs text-gray-500">Receive important updates about your account</p>
                              </div>
                              <Switch
                                id="email-notifications"
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="push-notifications" className="text-sm">
                                  Push Notifications
                                </Label>
                                <p className="text-xs text-gray-500">Receive notifications on your device</p>
                              </div>
                              <Switch
                                id="push-notifications"
                                checked={pushNotifications}
                                onCheckedChange={setPushNotifications}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="marketing-emails" className="text-sm">
                                  Marketing Emails
                                </Label>
                                <p className="text-xs text-gray-500">Receive promotional offers and updates</p>
                              </div>
                              <Switch
                                id="marketing-emails"
                                checked={marketingEmails}
                                onCheckedChange={setMarketingEmails}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setPrivacyDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setPrivacyDialogOpen(false)
                              toast({
                                title: "Privacy Settings Updated",
                                description: "Your privacy preferences have been saved.",
                              })
                            }}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                            <p className="text-sm text-gray-500">Get notified about subscription and billing updates</p>
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

                          <div className="space-y-3">
                            <Label>Notification Preferences</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  id="notify-renewal"
                                  className="rounded border-gray-300"
                                  defaultChecked
                                />
                                <Label htmlFor="notify-renewal" className="text-sm font-normal">
                                  Subscription Renewals
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  id="notify-payment"
                                  className="rounded border-gray-300"
                                  defaultChecked
                                />
                                <Label htmlFor="notify-payment" className="text-sm font-normal">
                                  Payment Processing
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  id="notify-expiration"
                                  className="rounded border-gray-300"
                                  defaultChecked
                                />
                                <Label htmlFor="notify-expiration" className="text-sm font-normal">
                                  Subscription Expiration
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  id="notify-price"
                                  className="rounded border-gray-300"
                                  defaultChecked
                                />
                                <Label htmlFor="notify-price" className="text-sm font-normal">
                                  Price Changes
                                </Label>
                              </div>
                            </div>
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
                                description: "You'll receive notifications about your billing and subscription.",
                                action: <ToastAction altText="Close">Close</ToastAction>,
                              })
                            }}
                          >
                            Save Preferences
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
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
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
              We&apos;d appreciate knowing why you want to delete your account. This helps us improve our service.
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
                    Please note that all active subscriptions will be lost and not refunded. You will lose access to all
                    premium features immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto" onClick={() => setDeleteConfirmationDialogOpen(false)}>
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

