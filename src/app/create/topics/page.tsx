"use client";

import SubjectsTopicsPage from "@/components/topics";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";

export default function TopicsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SubjectsTopicsPage />;
    </Suspense>
  );
}
