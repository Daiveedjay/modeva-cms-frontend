import QueryProvider from "@/app/(app)/query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Modeva Admin",
  description: "Modeva Admin Portal",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
        {children}
      </div>
    </QueryProvider>
  );
}
