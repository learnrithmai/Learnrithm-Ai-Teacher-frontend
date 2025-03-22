"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import GoogleButton from "./google-button";
import { useToast } from "@/hooks/use-toast";
import { ForgotPasswordSchema, LoginSchema } from "@/types/authSchema";
import logger from "@/utils/chalkLogger";
import { signIn } from "next-auth/react";

export default function Signin() {
  const { toast } = useToast();

  // Remove direct API test call to avoid extraneous requests.
  // useEffect(() => {
  //   async function test() {
  //     const test = await axios.get(`${SERVER_API_URL}/auth/test`);
  //     console.log(test)
  //   }
  //   test();
  // }, []);

  // Sign in form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Forgot password form remains as is.
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm<ForgotPasswordSchema>({
    defaultValues: { email: "" },
  });

  const hasAnimated = useRef(false);

  useEffect(() => {
    // Force a repaint to fix blurry content
    document.body.style.opacity = "0.99";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 10);

    // GSAP animation context for better cleanup.
    const ctx = gsap.context(() => {
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
    return () => ctx.revert();
  }, []);

  // Submit handler for the sign in form using NextAuth.
  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    // Call signIn with credentials provider.
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      isSignup: "false",
    });

    if (result?.ok) {
      toast({ title: "Signed in successfully" });
      setTimeout(() => (window.location.href = "/"), 2000);
    } else {
      logger.error("Error signing in", result?.error || "");
      toast({ title: "Error signing in" });
    }
  };

  // Submit handler for the forgot password form remains unchanged.
  const onForgotSubmit: SubmitHandler<ForgotPasswordSchema> = async (dataToSend) => {
    const lastSent = localStorage.getItem("lastResetTimestamp");
    const now = Date.now();

    // Check if a reset link was sent in the last 2 minutes.
    if (lastSent && now - parseInt(lastSent) < 120000) {
      toast({
        title: "Please wait 2 minutes before requesting another reset link.",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();

      if (response.ok) {
        toast({ title: result.message });
        localStorage.setItem("lastResetTimestamp", now.toString());
        resetForgotForm();
      } else {
        toast({ title: result.error || "Error sending reset link" });
      }
    } catch (error) {
      logger.error("Forgot password error", error as string);
      toast({ title: "Error sending reset link" });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding Section */}
      <div className="hidden lg:flex flex-col bg-[#0A0A0A] text-white p-12 justify-between">
        <div className="animate-in">
          <Image
            src="/logo.svg"
            width={120}
            height={40}
            alt="Logo"
            className="mb-20"
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#F3F5F9]">
            Welcome back!
          </h1>
        </div>
      </div>

      {/* Right: Form Section */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2 animate-in">
            <h2 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-gray-500">
              Welcome back! Please enter your details
            </p>
          </div>

          <div className="space-y-4 animate-in">
            <GoogleButton />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 animate-in"
            noValidate
          >
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                Remember me
              </label>
              {/* Forgot Password Dialog */}
              <Dialog>
                <DialogTrigger
                  asChild
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <button type="button">Forgot password?</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                      Enter your email address to reset your password
                    </DialogDescription>
                  </DialogHeader>
                  {/* Forgot Password Form */}
                  <form onSubmit={handleSubmitForgot(onForgotSubmit)}>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        placeholder="Email address"
                        {...registerForgot("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: "Invalid email address",
                          },
                        })}
                        className="bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
                      />
                      {forgotErrors.email && (
                        <p className="text-red-500 text-sm">
                          {forgotErrors.email.message}
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Send Link
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Sign in
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                prefetch
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}