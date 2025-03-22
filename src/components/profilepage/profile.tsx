"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
  Edit2,
  InfoIcon,
  Calendar,
  Building,
  Phone,
  Upload,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Lock,
} from "lucide-react"

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SERVER_API_URL } from "@/lib/consts"
import type { ForgotPasswordSchema } from "@/types/authSchema"
import type { changePasswordSchema, UpdateInfoSchema } from "@/types/userSchema"

// Add axios import at the top
import axios from "axios"

export default function ProfileComponent() {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [verificationEmailSent, setVerificationEmailSent] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false)
  const [editPersonalInfoOpen, setEditPersonalInfoOpen] = useState(false)
  const [editSocialMediaOpen, setEditSocialMediaOpen] = useState(false)
  const [formChanged, setFormChanged] = useState(false)
  const [socialFormChanged, setSocialFormChanged] = useState(false)

  // Personal info form state
  const [originalPersonalInfo, setOriginalPersonalInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    birthDate: "1990-05-15",
    country: "United States",
    institution: "Harvard University",
    phoneNumber: "+1 (555) 123-4567",
  })

  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    birthDate: "1990-05-15",
    country: "United States",
    institution: "Harvard University",
    phoneNumber: "+1 (555) 123-4567",
  })

  // Social media form state
  const [originalSocialMedia, setOriginalSocialMedia] = useState({
    linkedin: "johndoe",
    instagram: "johndoe",
    facebook: "johndoe",
    x: "johndoe",
  })

  const [socialMedia, setSocialMedia] = useState({
    linkedin: "johndoe",
    instagram: "johndoe",
    facebook: "johndoe",
    x: "johndoe",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Check if personal info form has changed
  useEffect(() => {
    const hasChanged =
      personalInfo.name !== originalPersonalInfo.name ||
      personalInfo.birthDate !== originalPersonalInfo.birthDate ||
      personalInfo.country !== originalPersonalInfo.country ||
      personalInfo.institution !== originalPersonalInfo.institution ||
      personalInfo.phoneNumber !== originalPersonalInfo.phoneNumber

    setFormChanged(hasChanged)
  }, [personalInfo, originalPersonalInfo])

  // Check if social media form has changed
  useEffect(() => {
    const hasChanged =
      socialMedia.linkedin !== originalSocialMedia.linkedin ||
      socialMedia.instagram !== originalSocialMedia.instagram ||
      socialMedia.facebook !== originalSocialMedia.facebook ||
      socialMedia.x !== originalSocialMedia.x

    setSocialFormChanged(hasChanged)
  }, [socialMedia, originalSocialMedia])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!oldPassword) {
        toast({
          title: "Error",
          description: "Please enter your current password",
          variant: "destructive",
        })
        return
      }

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match!",
          variant: "destructive",
        })
        return
      }

      const dataToSend: changePasswordSchema = {
        id: "ss",
        password: oldPassword,
        newPassword: password,
      }

      const { status, data }: { status: number; data: { error?: string; message?: string } } = await axios.post(
        `${SERVER_API_URL}/user/update-password`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      if (status === 200) {
        // Handle password update
        toast({
          title: "Success",
          description: "Password updated successfully",
        })
        setOldPassword("")
        setPassword("")
        setConfirmPassword("")
      } else if (status === 404 && data.error) {
        toast({ title: data.error })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Error Updating password" })
    }
  }

  const sendVerificationEmail = async () => {
    try {
      const dataToSend: ForgotPasswordSchema = {
        email: personalInfo.email,
      }
      const { status, data }: { status: number; data: { error?: string; message?: string } } = await axios.post(
        `${SERVER_API_URL}/auth/send-verification-email`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      if (status === 200) {
        setVerificationEmailSent(true)
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox and follow the instructions",
        })
      } else if (status === 404 && data.error) {
        toast({ title: data.error })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Error sending verification link" })
    }
  }

  const handleForgotPassword = () => {
    // Open the forgot password dialog
    setForgotPasswordOpen(true)
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!forgotPasswordEmail) {
        return toast({
          title: "Please Enter your email",
        })
      }
      const dataToSend: ForgotPasswordSchema = {
        email: forgotPasswordEmail,
      }
      const { status, data }: { status: number; data: { error?: string; message?: string } } = await axios.post(
        `${SERVER_API_URL}/auth/forgot-password`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      if (status === 200) {
        toast({ title: data.message })
        setForgotPasswordSent(true)
        toast({
          title: "Password Reset Link Sent",
          description: "Check your email for instructions to reset your password",
        })
        setTimeout(() => {
          setForgotPasswordEmail("")
          setForgotPasswordSent(false)
          setForgotPasswordOpen(false)
        }, 3000)
      } else if (status === 404 && data.error) {
        toast({ title: data.error })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Error sending reset link" })
    }
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setProfileImageUrl(imageUrl)
      setUploadImageDialogOpen(false)

      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been updated successfully",
      })
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formChanged) {
        return toast({
          title: "No Field changed!",
        })
      }

      const dataToSend: UpdateInfoSchema = { ...personalInfo, id: "zzz" }

      const { status, data }: { status: number; data: { error?: string; message?: string } } = await axios.post(
        `${SERVER_API_URL}/user/update-info`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      if (status === 200) {
        // Update the original state to match the current state
        setOriginalPersonalInfo({ ...personalInfo })
        setFormChanged(false)
        setEditPersonalInfoOpen(false)

        toast({
          title: "Personal Information Updated",
          description: "Your personal information has been updated successfully",
        })
      } else if (status === 404 && data.error) {
        toast({ title: data.error })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Error sending reset link" })
    }
  }

  const handleSocialMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    e.preventDefault()

    try {
      if (!formChanged) {
        return toast({
          title: "No Field changed!",
        })
      }

      const dataToSend: UpdateInfoSchema = {
        ...socialMedia,
        id: "zzz",
      }
      const { status, data }: { status: number; data: { error?: string; message?: string } } = await axios.post(
        `${SERVER_API_URL}/user/update-info`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      if (status === 200) {
        // Update the original state to match the current state
        setOriginalSocialMedia({ ...socialMedia })
        setSocialFormChanged(false)
        setEditSocialMediaOpen(false)

        toast({
          title: "Social Media Updated",
          description: "Your social media links have been updated successfully",
        })
      } else if (status === 404 && data.error) {
        toast({ title: data.error })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Error sending reset link" })
    }
  }

  return (
    <div className="grid gap-6">
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address below and we&apos;ll send you a link to reset your password.
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
                <Button type="button" variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Reset Link</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Profile Image Dialog */}
      <Dialog open={uploadImageDialogOpen} onOpenChange={setUploadImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Profile Image</DialogTitle>
            <DialogDescription>
              Choose a new profile image to upload. The image should be square for best results.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center">
            <div
              className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={triggerFileInput}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to browse</p>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageUpload}
            />
            <p className="text-xs text-gray-500 mt-4">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadImageDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Information Dialog */}
      <Dialog open={editPersonalInfoOpen} onOpenChange={setEditPersonalInfoOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Personal Information</DialogTitle>
            <DialogDescription>Update your personal details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePersonalInfoSubmit} className="py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={personalInfo.email}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-birthdate">Birth Date</Label>
                <Input
                  id="edit-birthdate"
                  type="date"
                  value={personalInfo.birthDate}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      birthDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input id="edit-country" disabled value={personalInfo.country} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-institution">Institution</Label>
                <Input
                  id="edit-institution"
                  value={personalInfo.institution}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      institution: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={personalInfo.phoneNumber}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditPersonalInfoOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formChanged}>
                {formChanged ? "Submit Changes" : "No Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Social Media Dialog */}
      <Dialog open={editSocialMediaOpen} onOpenChange={setEditSocialMediaOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Social Media</DialogTitle>
            <DialogDescription>Update your social media profiles.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSocialMediaSubmit} className="py-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-[#0077B5]" /> LinkedIn
                </Label>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                    linkedin.com/in/
                  </span>
                  <Input
                    id="edit-linkedin"
                    value={socialMedia.linkedin}
                    onChange={(e) =>
                      setSocialMedia({
                        ...socialMedia,
                        linkedin: e.target.value,
                      })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-[#E1306C]" /> Instagram
                </Label>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                    instagram.com/
                  </span>
                  <Input
                    id="edit-instagram"
                    value={socialMedia.instagram}
                    onChange={(e) =>
                      setSocialMedia({
                        ...socialMedia,
                        instagram: e.target.value,
                      })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
                </Label>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                    facebook.com/
                  </span>
                  <Input
                    id="edit-facebook"
                    value={socialMedia.facebook}
                    onChange={(e) =>
                      setSocialMedia({
                        ...socialMedia,
                        facebook: e.target.value,
                      })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-[#1DA1F2]" /> X (Twitter)
                </Label>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                    x.com/
                  </span>
                  <Input
                    id="edit-twitter"
                    value={socialMedia.x}
                    onChange={(e) =>
                      setSocialMedia({
                        ...socialMedia,
                        x: e.target.value,
                      })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditSocialMediaOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!socialFormChanged}>
                {socialFormChanged ? "Submit Changes" : "No Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                <CardDescription>Manage your personal details and settings</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                onClick={() => setEditPersonalInfoOpen(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 p-4 rounded-lg bg-gray-50/50 border border-gray-100">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                </div>
                <p className="text-gray-900 font-medium pl-6">{personalInfo.name}</p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <label className="text-sm font-medium text-gray-500">Email</label>
                  </div>
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
                <p className="text-gray-900 font-medium pl-6">{personalInfo.email}</p>

                {!isVerified && (
                  <div className="mt-2 pl-6">
                    {verificationEmailSent ? (
                      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                        <AlertDescription className="flex items-center">
                          <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                          Verification email sent! Check your inbox and follow the instructions.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={sendVerificationEmail}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Verify Email
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <label className="text-sm font-medium text-gray-500">Birth Date</label>
                </div>
                <p className="text-gray-900 font-medium pl-6">
                  {new Date(personalInfo.birthDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  <label className="text-sm font-medium text-gray-500">Country</label>
                </div>
                <p className="text-gray-900 font-medium pl-6">{personalInfo.country}</p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-2" />
                  <label className="text-sm font-medium text-gray-500">Institution</label>
                </div>
                <p className="text-gray-900 font-medium pl-6">{personalInfo.institution}</p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                </div>
                <p className="text-gray-900 font-medium pl-6">{personalInfo.phoneNumber}</p>
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Social Media</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  onClick={() => setEditSocialMediaOpen(true)}
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://linkedin.com/in/${socialMedia.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Linkedin className="h-6 w-6 text-[#0077B5] mb-2" />
                        <span className="text-sm text-gray-600 truncate max-w-full">LinkedIn</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>linkedin.com/in/{socialMedia.linkedin}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://instagram.com/${socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Instagram className="h-6 w-6 text-[#E1306C] mb-2" />
                        <span className="text-sm text-gray-600 truncate max-w-full">Instagram</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>instagram.com/{socialMedia.instagram}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://facebook.com/${socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Facebook className="h-6 w-6 text-[#1877F2] mb-2" />
                        <span className="text-sm text-gray-600 truncate max-w-full">Facebook</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>facebook.com/{socialMedia.facebook}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://x.com/${socialMedia.x}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Twitter className="h-6 w-6 text-[#1DA1F2] mb-2" />
                        <span className="text-sm text-gray-600 truncate max-w-full">X (Twitter)</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>x.com/{socialMedia.x}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-gray-400" />
                  Password Management
                </h3>
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
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pr-10"
                      placeholder="Enter current password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      placeholder="Enter new password"
                      required
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
                      required
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

              <Button
                type="submit"
                className="bg-[#1877F2] hover:bg-[#1877F2]/90 w-full"
                disabled={!oldPassword || !password || !confirmPassword}
              >
                {oldPassword && password && confirmPassword ? "Update Password" : "Enter All Fields"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

