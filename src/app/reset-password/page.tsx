"use client"
import React from "react";
import ResetPasswordContent from "@/components/rest-password/reset-password-content";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordContent />
    </Suspense>
  );
}