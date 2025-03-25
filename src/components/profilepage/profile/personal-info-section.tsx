"use client"

import type React from "react"

import { User, Mail, Calendar, Globe, Building, Phone, Edit2, InfoIcon, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { PersonalInfo } from "./use-profile-state"
import type { ForgotPasswordSchema } from "@/types/authSchema"

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo
  isVerified: boolean
  verificationEmailSent: boolean
  setVerificationEmailSent: (value: boolean) => void
  onEditClick: () => void
}

export default function PersonalInfoSection({
  personalInfo,
  isVerified,
  verificationEmailSent,
  setVerificationEmailSent,
  onEditClick,
}: PersonalInfoSectionProps) {
  const { toast } = useToast()

  const sendVerificationEmail = async () => {
    try {
      const dataToSend: ForgotPasswordSchema = {
        email: personalInfo.email,
      }

      // In a real app, this would be an actual API call
      // For now, we'll simulate a successful response
      setVerificationEmailSent(true)
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and follow the instructions",
      })
    } catch (error) {
      console.error(error)
      toast({ title: "Error sending verification link" })
    }
  }

  return (
    <>
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
            onClick={onEditClick}
          >
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 p-4 rounded-lg bg-gray-50/50 border border-gray-100">
          <InfoField
            icon={<User className="h-4 w-4 text-gray-400 mr-2" />}
            label="Full Name"
            value={personalInfo.name}
          />

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

          <InfoField
            icon={<Calendar className="h-4 w-4 text-gray-400 mr-2" />}
            label="Birth Date"
            value={new Date(personalInfo.birthDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />

          <InfoField
            icon={<Globe className="h-4 w-4 text-gray-400 mr-2" />}
            label="Country"
            value={personalInfo.country}
          />

          <InfoField
            icon={<Building className="h-4 w-4 text-gray-400 mr-2" />}
            label="Institution"
            value={personalInfo.institution}
          />

          <InfoField
            icon={<Phone className="h-4 w-4 text-gray-400 mr-2" />}
            label="Phone Number"
            value={personalInfo.phoneNumber}
          />
        </div>
      </CardContent>
    </>
  )
}

interface InfoFieldProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoField({ icon, label, value }: InfoFieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        {icon}
        <label className="text-sm font-medium text-gray-500">{label}</label>
      </div>
      <p className="text-gray-900 font-medium pl-6">{value}</p>
    </div>
  )
}

