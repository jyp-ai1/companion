import { Suspense } from "react";
import { ExperienceGuide } from "@/components/experience/ExperienceGuide";

function LoadingGuide() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <p className="text-gray-600">잠시만요...</p>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<LoadingGuide />}>
      <ExperienceGuide />
    </Suspense>
  );
}
