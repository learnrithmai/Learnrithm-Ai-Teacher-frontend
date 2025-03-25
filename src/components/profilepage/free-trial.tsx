"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, AlertTriangle, CheckCircle, Gift, Calendar, ArrowRight, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select } from "../ui/select"

interface FreeTrialProps {
  startDate: string
  endDate: string
  daysLeft: number
  percentLeft: number
  features: string[]
  onUpgrade?: () => void
}

export default function FreeTrial({
  startDate = "Mar 15, 2025",
  endDate = "Apr 14, 2025",
  daysLeft = 24,
  percentLeft = 80,
  features = ["All Pro features", "Unlimited projects", "Advanced analytics", "Priority support", "Team collaboration"],
  onUpgrade,
}: FreeTrialProps) {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [extendDialogOpen, setExtendDialogOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = () => {
    setUpgradeDialogOpen(false)
    if (onUpgrade) {
      onUpgrade()
    } else {
      toast({
        title: "Upgrade Successful",
        description: "You've been upgraded to the Pro plan. Enjoy all the premium features!",
      })
    }

    // Show confetti effect
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleExtendTrial = () => {
    setExtendDialogOpen(false)
    toast({
      title: "Trial Extended",
      description: "Your free trial has been extended by 7 days. Enjoy the extra time!",
    })
  }

  // Calculate urgency level based on days left
  const getUrgencyLevel = () => {
    if (daysLeft <= 3) return "high"
    if (daysLeft <= 7) return "medium"
    return "low"
  }

  const urgencyLevel = getUrgencyLevel()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <Gift className="h-3.5 w-3.5 mr-1" />
                  Free Trial
                </Badge>
                {urgencyLevel === "high" && (
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    Ending Soon
                  </Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-xl font-bold mt-2">Pro Plan Trial</CardTitle>
            <CardDescription>Experience all premium features before deciding</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trial Period</span>
                <span className="font-medium">
                  {startDate} - {endDate}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Remaining</span>
                  <span
                    className={`font-medium ${
                      urgencyLevel === "high"
                        ? "text-red-600"
                        : urgencyLevel === "medium"
                          ? "text-amber-600"
                          : "text-blue-600"
                    }`}
                  >
                    {daysLeft} days left
                  </span>
                </div>
                <Progress
                  value={percentLeft}
                  className={`h-2 ${
                    urgencyLevel === "high" ? "bg-red-100" : urgencyLevel === "medium" ? "bg-amber-100" : "bg-blue-100"
                  }`}
                />
              </div>

              {urgencyLevel === "high" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Your trial is ending soon</p>
                    <p className="text-xs text-red-700 mt-0.5">
                      Upgrade now to avoid losing access to premium features.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-medium text-sm">Included in Your Trial</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gradient-to-r from-blue-100 to-blue-50 border-t rounded-b-lg">
            <div className="flex-1">
              <h4 className="font-medium mb-1">Ready to commit?</h4>
              <p className="text-sm text-gray-600 mb-3">Upgrade now to continue enjoying all premium features</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700"
                  onClick={() => setUpgradeDialogOpen(true)}
                >
                  Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setExtendDialogOpen(true)}>
                  Extend Trial
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upgrade to Pro Plan</DialogTitle>
            <DialogDescription>Continue enjoying all premium features without interruption</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">Pro</Badge>
                  <h3 className="font-medium">Pro Plan</h3>
                </div>
                <span className="font-bold">$99.99/year</span>
              </div>

              <Separator />

              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Special Trial Offer</p>
                  <p className="text-sm text-blue-700 mt-1">Upgrade today and get 10% off your first year!</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Not Now
            </Button>
            <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Trial Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Extend Your Free Trial</DialogTitle>
            <DialogDescription>Need more time to evaluate? We can help with that.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">7-Day Extension</p>
                  <p className="text-sm text-blue-700 mt-1">
                    We can extend your trial for an additional 7 days to help you make your decision.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Why do you need more time?</h4>
              <div className="w-full p-2 border rounded-md">
                <Select>
                <option>I haven&apos;t had time to fully explore the features</option>
                <option>I&apos;m still comparing with other solutions</option>
                <option>I need to get approval from my team</option>
                <option>I&apos;m waiting for my next payment cycle</option>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtendTrial}>Extend Trial</Button>
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

