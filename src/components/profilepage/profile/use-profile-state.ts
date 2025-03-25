"use client"

import { useState, useEffect } from "react"

// Define types for our state
export interface PersonalInfo {
  name: string
  email: string
  birthDate: string
  country: string
  institution: string
  phoneNumber: string
}

export interface SocialMedia {
  linkedin: string
  instagram: string
  facebook: string
  x: string
}

export function useProfileState() {
  // Personal info form state
  const [originalPersonalInfo, setOriginalPersonalInfo] = useState<PersonalInfo>({
    name: "John Doe",
    email: "john.doe@example.com",
    birthDate: "1990-05-15",
    country: "United States",
    institution: "Harvard University",
    phoneNumber: "+1 (555) 123-4567",
  })

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ ...originalPersonalInfo })

  // Social media form state
  const [originalSocialMedia, setOriginalSocialMedia] = useState<SocialMedia>({
    linkedin: "johndoe",
    instagram: "johndoe",
    facebook: "johndoe",
    x: "johndoe",
  })

  const [socialMedia, setSocialMedia] = useState<SocialMedia>({ ...originalSocialMedia })

  // Other state
  const [isVerified, setIsVerified] = useState(false)
  const [verificationEmailSent, setVerificationEmailSent] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [formChanged, setFormChanged] = useState(false)
  const [socialFormChanged, setSocialFormChanged] = useState(false)

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

  return {
    personalInfo,
    setPersonalInfo,
    originalPersonalInfo,
    setOriginalPersonalInfo,
    socialMedia,
    setSocialMedia,
    originalSocialMedia,
    setOriginalSocialMedia,
    isVerified,
    setIsVerified,
    verificationEmailSent,
    setVerificationEmailSent,
    profileImageUrl,
    setProfileImageUrl,
    formChanged,
    socialFormChanged,
  }
}

