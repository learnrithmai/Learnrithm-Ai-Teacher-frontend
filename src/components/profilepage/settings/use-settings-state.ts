"use client"

import { useState, useEffect } from "react"

export function useSettingsState() {
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [billingEmail, setBillingEmail] = useState("john.doe@example.com")
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [bellShake, setBellShake] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("system")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [themeChanged, setThemeChanged] = useState(false)
  const [exportFormat, setExportFormat] = useState("json")

  // Check if theme settings have changed
  useEffect(() => {
    const originalTheme = "system"
    const originalColor = "blue"

    setThemeChanged(selectedTheme !== originalTheme || selectedColor !== originalColor)
  }, [selectedTheme, selectedColor])

  return {
    selectedLanguage,
    setSelectedLanguage,
    billingEmail,
    setBillingEmail,
    deleteConfirmText,
    setDeleteConfirmText,
    deleteReason,
    setDeleteReason,
    bellShake,
    setBellShake,
    showConfetti,
    setShowConfetti,
    darkMode,
    setDarkMode,
    emailNotifications,
    setEmailNotifications,
    pushNotifications,
    setPushNotifications,
    marketingEmails,
    setMarketingEmails,
    selectedTheme,
    setSelectedTheme,
    selectedColor,
    setSelectedColor,
    themeChanged,
    exportFormat,
    setExportFormat,
  }
}

