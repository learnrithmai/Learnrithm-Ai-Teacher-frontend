import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifySuccessPage({
  searchParams,
}: {
  searchParams: { next?: string }
}) {
  const nextUrl = searchParams.next || "/"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Email Verified</CardTitle>
          <CardDescription>Your email has been successfully verified.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Thank you for verifying your email address. You can now access all features of your account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href={nextUrl}>Continue to your account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessage = searchParams.error || "An unknown error occurred"
  const isExpired = errorMessage.toLowerCase().includes("expired")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Verification Failed</CardTitle>
          <CardDescription>We couldn't verify your email address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error details</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-600">
            {isExpired ? (
              <p>Your verification link has expired. Please request a new verification email.</p>
            ) : (
              <p>The verification link is invalid or has been used already.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/auth/login">Back to login</Link>
          </Button>
          {isExpired && (
            <Button asChild>
              <Link href="/auth/resend-verification">Resend verification</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

