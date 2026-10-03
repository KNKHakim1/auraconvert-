import { Suspense } from "react";
import { ToolsIndexPage } from "@/components/tools/ToolsIndexPage";

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/5" />}>
      <ToolsIndexPage />
    </Suspense>
  );
}
