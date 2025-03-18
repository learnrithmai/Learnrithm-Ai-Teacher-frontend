"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, CheckCircle, AlertCircle, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ProfileComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [verificationEmailSent, setVerificationEmailSent] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      })
      return
    }
    // Handle password update
    toast({
      title: "Success",
      description: "Password updated successfully",
    })
    setPassword("")
    setConfirmPassword("")
  }

  const sendVerificationEmail = () => {
    // API call to send verification email would go here
    setVerificationEmailSent(true)
    toast({
      title: "Verification Email Sent",
      description: "Please check your inbox and follow the instructions",
    })
  }

  const handleForgotPassword = () => {
    // Open the forgot password dialog
    setForgotPasswordOpen(true)
  }

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // API call to send password reset email would go here
    setForgotPasswordSent(true)
    
    // Show toast notification
    toast({
      title: "Password Reset Link Sent",
      description: "Check your email for instructions to reset your password",
    })
    
    // Reset form after a delay so the user can see the success message
    setTimeout(() => {
      setForgotPasswordEmail("")
      setForgotPasswordSent(false)
      setForgotPasswordOpen(false)
    }, 3000)
  }

  return (
    <div className="grid gap-6">
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address below and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {forgotPasswordSent ? (
            <div className="py-6">
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertDescription className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reset link has been sent to your email.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your.email@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Send Reset Link</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-500">Email</label>
                {isVerified ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    <CheckCircle className="mr-1 h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                    <AlertCircle className="mr-1 h-3 w-3" /> Unverified
                  </span>
                )}
              </div>
              <p className="text-gray-900">john.doe@example.com</p>
              
              {!isVerified && (
                <div className="mt-2">
                  {verificationEmailSent ? (
                    <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                      <AlertDescription>
                        Verification email sent! Check your inbox and follow the instructions.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-1"
                      onClick={sendVerificationEmail}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Verify Email
                    </Button>
                  )}
                </div>
              )}
              <Separator className="mt-2" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-900">New York, USA</p>
              <Separator />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Password Management</h3>
                <Button 
                  variant="ghost" 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </Button>
              </div>
              
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
  )
}