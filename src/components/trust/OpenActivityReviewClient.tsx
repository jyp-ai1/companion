"use client";

import { useRouter } from "next/navigation";
import { submitOpenActivityReview } from "@/app/actions/trust";
import {
  ActivityReviewForm,
  type CoParticipant,
} from "@/components/trust/ActivityReviewForm";

export function OpenActivityReviewClient({
  activityId,
  peers,
}: {
  activityId: string;
  peers: CoParticipant[];
}) {
  const router = useRouter();

  return (
    <ActivityReviewForm
      peers={peers}
      onSubmit={async (data) => {
        const res = await submitOpenActivityReview({
          activityId,
          ...data,
        });
        if (res.ok) {
          router.push("/home");
          router.refresh();
        }
        return res;
      }}
    />
  );
}
