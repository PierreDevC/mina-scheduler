import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SchedulerProvider } from "@/providers/schedular-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { PreferencesProvider } from "@/contexts/preferences-context";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mina Scheduler - NextJS/React Shadcn UI Calendar",
  description:
    "A lightweight, customizable calendar and scheduler component built with NextJS/React and Shadcn UI | Next UI Calendar",
  keywords:
    "shadcn ui, shadcn, shadcn full calendar, calendar, scheduler, tailwind, react, nextjs, event management, date picker, next ui calendar, mina scheduler, full calendar, Mina Scheduler",
  authors: [{ name: "Mina Massoud" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mina-scheduler.vercel.app/",
    title: "Mina Scheduler - NextJS/React Shadcn UI Calendar",
    description: "A lightweight, customizable calendar and scheduler component built with NextJS/React and Shadcn UI",
    siteName: "Mina Scheduler",
    images: [
      {
        url: "https://mina-scheduler.vercel.app/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Mina Scheduler - A customizable scheduler for NextJS and React"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina Scheduler - NextJS/React Shadcn UI Calendar",
    description: "A lightweight, customizable calendar and scheduler component built with NextJS/React and Shadcn UI",
    images: ["https://mina-scheduler.vercel.app/opengraph.png"]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
        >
          <PreferencesProvider>
            <SchedulerProvider weekStartsOn="monday">{children}</SchedulerProvider>
          </PreferencesProvider>
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
