"use client"

import { CheckCircle } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FeaturesListProps {
  features: string[]
}

export default function FeaturesList({ features }: FeaturesListProps) {
  return (
    <CardContent className="space-y-6">
      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium text-sm">Included Features</h3>
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
  )
}

