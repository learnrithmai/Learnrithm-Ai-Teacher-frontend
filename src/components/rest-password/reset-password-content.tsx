"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ForgotPasswordSchema, resetPasswordSchema } from "@/types/authSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { SERVER_API_URL } from "@/lib/consts";

export default function ResetPasswordContent() {
  // Reset password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<resetPasswordSchema>({
    defaultValues: { password: "", token: "" },
  });

  // useSearchParams now is inside a Suspense boundary.
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // Set token value in the form data regardless of token validity.
  registerPassword("token", { value: token ?? undefined });

  const { toast } = useToast();
  const router = useRouter();

  // State for password reset submission and success countdown.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  // State to indicate if the token is invalid/expired.
  const [invalidToken, setInvalidToken] = useState(false);

  // Countdown effect after a successful reset
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resetSuccess && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (resetSuccess && countdown === 0) {
      router.push("/auth/login");
    }
    return () => clearInterval(interval);
  }, [resetSuccess, countdown, router]);

  const onPasswordSubmit: SubmitHandler<resetPasswordSchema> = async (dataToSend) => {
    setIsSubmitting(true);
    try {
      const {
        status,
        data,
      }: { status: number; data: { error?: string; message?: string } } =
        await axios.post(
          `${SERVER_API_URL}/auth/reset-password?token=${dataToSend.token}`,
          { password: dataToSend.password },
          { headers: { "Content-Type": "application/json" } }
        );

      if (status === 200) {
        toast({ title: data.message });
        resetPasswordForm();
        // Set reset success and start the countdown to login.
        setResetSuccess(true);
      } else if (status === 404 && data.error) {
        // Set invalidToken state so that an error UI is shown.
        setInvalidToken(true);
        toast({ title: data.error });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error resetting password" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot password form for requesting a new reset link
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm<ForgotPasswordSchema>({
    defaultValues: { email: "" },
  });

  // Submit handler for the forgot password form
  const onForgotSubmit: SubmitHandler<ForgotPasswordSchema> = async (dataToSend) => {
    const lastSent = localStorage.getItem("lastResetTimestamp");
    const now = Date.now();

    // Check if a reset link was sent in the last 2 minutes
    if (lastSent && now - parseInt(lastSent) < 120000) {
      toast({
        title: "Please wait 2 minutes before requesting another reset link.",
      });
      return;
    }

    try {
      const {
        status,
        data,
      }: { status: number; data: { error?: string; message?: string } } = await axios.post(
        `${SERVER_API_URL}/auth/forgot-password`,
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 200) {
        toast({ title: data.message });
        localStorage.setItem("lastResetTimestamp", now.toString());
        resetForgotForm();
      } else if (status === 404 && data.error) {
        forgotErrors.email = { type: "manual", message: data.error };
        toast({ title: data.error });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error sending reset link" });
    }
  };

  // If the reset was successful, show a success message with countdown.
  if (resetSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="mt-4 text-2xl font-bold">Password Reset Successful</CardTitle>
            <CardDescription>
              Redirecting to login in {countdown} second{countdown !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Your password has been reset successfully. Please wait while we redirect you.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={() => router.push("/auth/login")}>Go to Login Now</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If the token was deemed invalid by the API, show an error message along with a dialog
  // to request a new reset link.
  if (invalidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="mt-4 text-2xl font-bold">Invalid or Expired Token</CardTitle>
            <CardDescription>The reset token provided is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>If you want to request a new password reset, please click below.</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Dialog>
              <DialogTrigger
                asChild
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <button type="button">Request New Reset Link</button>
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
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
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
                      <p className="text-red-500 text-sm">{forgotErrors.email.message}</p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Send Link
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Link href="/signin" className="text-center text-primary hover:underline">
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Otherwise, always show the reset password form.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="mt-4 text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  {...registerPassword("password", { required: "Password is required" })}
                />
                {passwordErrors.password && (
                  <p className="text-red-500 text-sm">{passwordErrors.password.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? "Submitting..." : "Reset Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}