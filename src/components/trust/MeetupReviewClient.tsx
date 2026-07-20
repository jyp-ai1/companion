"use client";

import { useRouter } from "next/navigation";
import { submitMeetupReview } from "@/app/actions/trust";
import {
  ActivityReviewForm,
  type CoParticipant,
} from "@/components/trust/ActivityReviewForm";

export function MeetupReviewClient({
  meetupId,
  peers,
}: {
  meetupId: string;
  peers: CoParticipant[];
}) {
  const router = useRouter();

  return (
    <ActivityReviewForm
      peers={peers}
      onSubmit={async (data) => {
        const res = await submitMeetupReview({
          meetupId,
          ...data,
        });
        if (res.ok) {
          router.push("/my");
          router.refresh();
        }
        return res;
      }}
    />
  );
}
