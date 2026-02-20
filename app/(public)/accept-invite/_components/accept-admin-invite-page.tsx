"use client";

import { Suspense } from "react";
import AcceptAdminInviteContent from "./accept-admin-invite-content";

export default function AcceptAdminInvitePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AcceptAdminInviteContent />
    </Suspense>
  );
}
