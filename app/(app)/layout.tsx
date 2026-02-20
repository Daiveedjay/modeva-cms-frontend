

import type { Metadata } from "next";
import type React from "react";
import "@/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutClient from "@/app/(app)/layout-client";

export const metadata: Metadata = {
  title: "Modeva CMS",
  description: "Manage your fashion e-commerce with ease",
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
