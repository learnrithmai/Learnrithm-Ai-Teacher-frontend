"use client";

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
import { SubmitHandler, useForm } from "react-hook-form";
import { SERVER_API_URL } from "@/lib/consts";

interface ResendVerificationSchema {
  email: string;
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { toast } = useToast();

  // State for token verification
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // State for success countdown
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // React Hook Form for resend verification email
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResendVerificationSchema>({ defaultValues: { email: "" } });

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenValid(false);
        setIsVerifying(false);
        return;
      }
      try {
        const response = await axios.post(
          `${SERVER_API_URL}/auth/verify-email?token=${token}`,
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        // Expecting a 204 No Content on success
        if (response.status === 204) {
          setTokenValid(true);
          setVerifySuccess(true);
          toast({ title: "Email verified successfully" });
        } else {
          setTokenValid(false);
          toast({ title: "Invalid or expired token" });
        }
      } catch (error) {
        console.error(error);
        setTokenValid(false);
        toast({ title: "Invalid or expired token" });
      } finally {
        setIsVerifying(false);
      }
    }
    verifyToken();
  }, [token, toast]);

  // Countdown effect after successful verification
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verifySuccess && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (verifySuccess && countdown === 0) {
      router.push("/auth/login");
    }
    return () => clearInterval(interval);
  }, [verifySuccess, countdown, router]);

  const onResendSubmit: SubmitHandler<ResendVerificationSchema> = async (
    data
  ) => {
    setIsResending(true);
    try {
      const { status, data: resData } = await axios.post<{
        message?: string;
        error?: string;
      }>(`${SERVER_API_URL}/auth/send-verification-email`, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (status === 200 && resData.message) {
        toast({ title: resData.message });
        reset();
      } else if (status === 404 && resData.error) {
        toast({ title: resData.error });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error sending verification link" });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verifying token...</p>
      </div>
    );
  }

  if (tokenValid && verifySuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="mt-4 text-2xl font-bold">
              Email Verified Successfully
            </CardTitle>
            <CardDescription>
              Redirecting to login in {countdown} second
              {countdown !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Your email has been verified. You will be redirected shortly.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={() => router.push("/auth/login")}>
              Go to Login Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } else {
    // Token is invalid/expired: show error message and dialog to request a new verification link
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="mt-4 text-2xl font-bold">
              Invalid or Expired Token
            </CardTitle>
            <CardDescription>
              The email verification token provided is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>
              If you want to request a new verification link, please click
              below.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Dialog>
              <DialogTrigger
                asChild
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <button type="button">Resend Verification Link</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Resend Verification Email</DialogTitle>
                  <DialogDescription>
                    Enter your email address to receive a new verification link.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onResendSubmit)}>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="resend-email">Email</Label>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={isResending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isResending ? "Sending..." : "Send Link"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Link
              href="/signin"
              className="text-center text-primary hover:underline"
            >
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
