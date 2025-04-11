// app/discussionroom/page.tsx
import DiscussionRoom from "@/components/DiscussionRoom";
import { Suspense } from "react";


export default function DiscussionRoomPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading chat...</div>}>
      <DiscussionRoom />
    </Suspense>
  );
}
