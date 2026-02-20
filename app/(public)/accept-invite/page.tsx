// File: app/admin/accept-invite/page.tsx
// This is the page component that uses the AcceptAdminInvitePage component

import AcceptInviteForm from "@/app/(public)/accept-invite/_components/accept-admin-invite-page";


export const metadata = {
  title: "Accept Admin Invitation | Modeva",
  description: "Accept your admin invitation and create your account",
};

export default function Page() {
  return <AcceptInviteForm/>;
}