"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import PersonalInfoSection from "./personal-info-section"
import SocialMediaSection from "./social-media-section"
import PasswordSection from "./password-section"
import ForgotPasswordDialog from "./dialogs/forgot-password-dialog"
import UploadImageDialog from "./dialogs/upload-image-dialog"
import EditPersonalInfoDialog from "./dialogs/edit-personal-info-dialog"
import EditSocialMediaDialog from "./dialogs/edit-social-media-dialog"
import { useProfileState } from "./use-profile-state"

export default function ProfileComponent() {
  const {
    personalInfo,
    setPersonalInfo,
    setOriginalPersonalInfo,
    socialMedia,
    setSocialMedia,
    setOriginalSocialMedia,
    isVerified,
    verificationEmailSent,
    setVerificationEmailSent,
    setProfileImageUrl,
    formChanged,
    socialFormChanged,
  } = useProfileState()

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false)
  const [editPersonalInfoOpen, setEditPersonalInfoOpen] = useState(false)
  const [editSocialMediaOpen, setEditSocialMediaOpen] = useState(false)

  return (
    <div className="grid gap-6">
      {/* Dialogs */}
      <ForgotPasswordDialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />

      <UploadImageDialog
        open={uploadImageDialogOpen}
        onOpenChange={setUploadImageDialogOpen}
        onImageUpload={setProfileImageUrl}
      />

      <EditPersonalInfoDialog
        open={editPersonalInfoOpen}
        onOpenChange={setEditPersonalInfoOpen}
        personalInfo={personalInfo}
        setPersonalInfo={setPersonalInfo}
        setOriginalPersonalInfo={setOriginalPersonalInfo}
        formChanged={formChanged}
      />

      <EditSocialMediaDialog
        open={editSocialMediaOpen}
        onOpenChange={setEditSocialMediaOpen}
        socialMedia={socialMedia}
        setSocialMedia={setSocialMedia}
        setOriginalSocialMedia={setOriginalSocialMedia}
        formChanged={socialFormChanged}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          {/* Personal Information Section */}
          <PersonalInfoSection
            personalInfo={personalInfo}
            isVerified={isVerified}
            verificationEmailSent={verificationEmailSent}
            setVerificationEmailSent={setVerificationEmailSent}
            onEditClick={() => setEditPersonalInfoOpen(true)}
          />

          {/* Social Media Section */}
          <SocialMediaSection socialMedia={socialMedia} onEditClick={() => setEditSocialMediaOpen(true)} />

          <Separator className="mx-6" />

          {/* Password Management Section */}
          <PasswordSection onForgotPasswordClick={() => setForgotPasswordOpen(true)} />
        </Card>
      </motion.div>
    </div>
  )
}

