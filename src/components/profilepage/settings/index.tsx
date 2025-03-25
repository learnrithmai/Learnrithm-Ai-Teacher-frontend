"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import SecuritySection from "./security-section"
import AccountSection from "./account-section"
import CommunicationSection from "./communication-section"
import DangerZoneSection from "./danger-zone-section"
import TwoFactorDialog from "./dialogs/two-factor-dialog"
import LanguageDialog from "./dialogs/language-dialog"
import ThemeDialog from "./dialogs/theme-dialog"
import DataExportDialog from "./dialogs/data-export-dialog"
import PrivacyDialog from "./dialogs/privacy-dialog"
import BillingNotificationsDialog from "./dialogs/billing-notifications-dialog"
import DeleteAccountDialog from "./dialogs/delete-account-dialog"
import DeleteReasonDialog from "./dialogs/delete-reason-dialog"
import DeleteConfirmationDialog from "./dialogs/delete-confirmation-dialog"
import { useSettingsState } from "./use-settings-state"

export default function SettingsComponent() {
  const {
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
  } = useSettingsState()

  const [twoFactorOpen, setTwoFactorOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)
  const [dataExportDialogOpen, setDataExportDialogOpen] = useState(false)
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)
  const [billingDialogOpen, setBillingDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteReasonDialogOpen, setDeleteReasonDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [exportInProgress, setExportInProgress] = useState(false)

  const { toast } = useToast()

  const handleBellClick = () => {
    setBellShake(true)
    setTimeout(() => setBellShake(false), 500)
    toast({
      title: "Subscription Reminder Set",
      description: "You'll be notified by email when your subscription is about to end.",
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
        {/* Dialogs */}
        <TwoFactorDialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen} />

        <LanguageDialog
          open={languageOpen}
          onOpenChange={setLanguageOpen}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />

        <ThemeDialog
          open={themeDialogOpen}
          onOpenChange={setThemeDialogOpen}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          themeChanged={themeChanged}
          onSubmit={handleThemeSubmit}
        />

        <DataExportDialog
          open={dataExportDialogOpen}
          onOpenChange={setDataExportDialogOpen}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          exportInProgress={exportInProgress}
          onExport={handleExportData}
        />

        <PrivacyDialog
          open={privacyDialogOpen}
          onOpenChange={setPrivacyDialogOpen}
          emailNotifications={emailNotifications}
          setEmailNotifications={setEmailNotifications}
          pushNotifications={pushNotifications}
          setPushNotifications={setPushNotifications}
          marketingEmails={marketingEmails}
          setMarketingEmails={setMarketingEmails}
        />

        <BillingNotificationsDialog
          open={billingDialogOpen}
          onOpenChange={setBillingDialogOpen}
          billingEmail={billingEmail}
          setBillingEmail={setBillingEmail}
          onSave={() => {
            setBillingDialogOpen(false)
            showConfettiEffect()
            toast({
              title: "Billing Notifications Enabled",
              description: "You'll receive notifications about your billing and subscription.",
            })
          }}
        />

        <DeleteAccountDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          deleteConfirmText={deleteConfirmText}
          setDeleteConfirmText={setDeleteConfirmText}
          onDelete={() => {
            setDeleteDialogOpen(false)
            setDeleteReasonDialogOpen(true)
          }}
        />

        <DeleteReasonDialog
          open={deleteReasonDialogOpen}
          onOpenChange={setDeleteReasonDialogOpen}
          deleteReason={deleteReason}
          setDeleteReason={setDeleteReason}
          onDelete={() => {
            setDeleteReasonDialogOpen(false)
            setDeleteConfirmationDialogOpen(true)
          }}
        />

        <DeleteConfirmationDialog open={deleteConfirmationDialogOpen} onOpenChange={setDeleteConfirmationDialogOpen} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card>
            {/* Security Section */}
            <SecuritySection onTwoFactorClick={() => setTwoFactorOpen(true)} />

            {/* Account Section */}
            <AccountSection
              selectedLanguage={selectedLanguage}
              onLanguageClick={() => setLanguageOpen(true)}
              onThemeClick={() => setThemeDialogOpen(true)}
              onDataExportClick={() => setDataExportDialogOpen(true)}
              onPrivacyClick={() => setPrivacyDialogOpen(true)}
            />

            {/* Communication Section */}
            <CommunicationSection
              bellShake={bellShake}
              onBillingClick={() => setBillingDialogOpen(true)}
              onBellClick={handleBellClick}
            />

            {/* Danger Zone Section */}
            <DangerZoneSection onDeleteClick={() => setDeleteDialogOpen(true)} />
          </Card>
        </motion.div>
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
    </>
  )
}

