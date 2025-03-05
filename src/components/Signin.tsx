"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export default function Signin() {
  // Use ref to track component mount status
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Force a repaint to fix blurry content
    document.body.style.opacity = '0.99';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 10);
    
    // Create a GSAP context for better cleanup
    const ctx = gsap.context(() => {
      // Only run animation if it hasn't run yet
      if (!hasAnimated.current) {
        gsap.from(".animate-in", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
        hasAnimated.current = true;
      }
    });
    
    // Clear animation context on unmount
    return () => ctx.revert();
  }, []);

  const handleGoogleSignIn = () => {
    // Implement Google OAuth
    console.log("Google Sign In")
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding Section */}
      <div className="hidden lg:flex flex-col bg-[#0A0A0A] text-white p-12 justify-between">
        <div className="animate-in">
          <Image src="/logo.svg" width={120} height={40} alt="Logo" className="mb-20" priority />
          <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome back!</h1>
        </div>
       
      </div>

      {/* Right: Form Section */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2 animate-in">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
            <p className="text-gray-500">Welcome back! Please enter your details</p>
          </div>

          <div className="space-y-4 animate-in">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full py-6 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>
          </div>

          <form className="space-y-4 animate-in">
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                className="h-12 px-4 bg-gray-50 border-2 border-gray-100 hover:border-gray-200 transition-colors focus:border-blue-600 focus:ring-0 focus:ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="h-12 px-4 bg-gray-50 border-2 border-gray-100 hover:border-gray-200 transition-colors focus:border-blue-600 focus:ring-0 focus:ring-offset-0"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                Remember me
              </label>
              <Link href="/forgot-password" prefetch={true} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Sign in
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup" prefetch={true} className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}