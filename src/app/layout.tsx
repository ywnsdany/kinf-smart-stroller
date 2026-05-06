import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KINFكِنف - Smart Baby Stroller System | نظام عربات الأطفال الذكي",
  description: "KINF هو نظام ذكي لمراقبة عربات الأطفال يوفر تتبع الموقع، مراقبة البطارية، قياس الانحدار، وتنبيهات فورية لحماية طفلك. Smart Baby Stroller Control System with real-time monitoring, GPS tracking, battery alerts, and incline detection.",
  keywords: ["KINF", "كنف", "smart stroller", "baby monitor", "عربة أطفال ذكية", "مراقبة الطفل", "GPS tracking", "baby safety"],
  authors: [{ name: "KINF Team" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "KINFكِنف - Smart Baby Stroller System",
    description: "نظام ذكي لمراقبة عربات الأطفال - حماية أمان طفلك",
    type: "website",
    images: ["/favicon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "KINFكِنف - Smart Baby Stroller System",
    description: "نظام ذكي لمراقبة عربات الأطفال - حماية أمان طفلك",
    images: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
