import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Suspense } from "react";
import { Loading } from "@/components/auth/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gplanner",
  description: "A streamlined note-taking and scheduling app",
  icons: {
    icon: "/plannerLogo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
        <ConvexClientProvider>
        <Toaster richColors/>
        {children}
        </ConvexClientProvider>
        </Suspense>
        </body>
    </html>
  );
}
