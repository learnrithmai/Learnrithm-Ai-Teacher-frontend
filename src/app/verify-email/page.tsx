"use client"
import React from "react";
import VerifyEmailContent from "@/components/verify-email/verify-email-content";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <VerifyEmailContent />
    </Suspense>
  );
}