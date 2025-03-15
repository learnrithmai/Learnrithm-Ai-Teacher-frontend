"use client";

import { Suspense } from "react";
import SubjectsTopicsPage from "@/components/topics";

export default function TopicsPage() {
  return (
    <Suspense fallback={<div>Loading topics…</div>}>
      <SubjectsTopicsPage />
    </Suspense>
  );
}