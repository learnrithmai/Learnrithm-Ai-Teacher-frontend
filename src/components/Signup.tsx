"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { countries } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import GoogleButton from "./google-button";
import { RegisterUserSchema } from "@/types/authSchema";
import logger from "@/utils/chalkLogger";
import { signIn } from "next-auth/react";

// Extend the RegisterUserSchema with a confirmPassword field for form validation.
type FormValues = RegisterUserSchema & {
  confirmPassword: string;
};

export default function Signup() {
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      Name: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      referralCode: "",
      method: "normal",
      image: "",
    },
  });

  const password = watch("password");

  // Animation setup
  const hasAnimated = useRef(false);
  useEffect(() => {
    document.body.style.opacity = "0.99";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 10);

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({ title: "Passwords do not match!" });
      return;
    }

    // Prepare data to be passed to the credentials provider.
    const credentials: RegisterUserSchema = {
      Name: data.Name,
      email: data.email,
      password: data.password,
      country: data.country,
      referralCode: data.referralCode,
      method: "normal",
    };

    // Use NextAuth signIn with the "credentials" provider.
    const result = await signIn("credentials", {
      redirect: false,
      ...credentials,
      isSignup: "true"
    });

    if (result?.ok) {
      toast({ title: "User registered successfully" });
      setTimeout(() => router.push("/"), 2000);
    } else {
      logger.error(
        "An error occurred during registration",
        result?.error || ""
      );
      toast({ title: "An error occurred during registration" });
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
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Start your learning journey today
          </h1>
          <p className="text-gray-400 text-lg">
            Join thousands of students and begin your path to success
          </p>
        </div>
      </div>

      {/* Right: Form Section */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2 animate-in">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h2>
            <p className="text-gray-500">
              Enter your information to get started
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 animate-in"
            noValidate
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  {...register("Name", { required: "First name is required" })}
                  placeholder="First name"
                  className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Input
                  {...register("Name", { required: "Last name is required" })}
                  placeholder="Last name"
                  className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Input
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Email address"
                className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectGroup>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum length is 6 characters",
                  },
                })}
                type="password"
                placeholder="Create password"
                className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                placeholder="Confirm password"
                className="h-12 px-4 bg-gray-50 border-2 border-gray-100 transition-colors focus:border-blue-600 focus:ring-0"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Create account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                prefetch
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
