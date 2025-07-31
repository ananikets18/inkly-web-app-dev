import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from 'geist/font/sans';
import { TooltipProvider } from "@/components/ui/tooltip";
import { FeedProvider } from "../hooks/feed-context";
import ClientRoot from "../components/ClientRoot";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Inkly - A Place",
  description: "A beautiful Pinterest-like interface for sharing thoughts and poetry",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#9333ea" />
      </head>
      <body className={GeistSans.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientRoot>
              <FeedProvider>
                <TooltipProvider>
                  {/*
                    For best UX, keep transitions and animations local to each page/component.
                    If you want to reintroduce subtle, non-blocking transitions globally, wrap children in a lightweight transition component here.
                    Example: <motion.div>{children}</motion.div> with a very short fade, but avoid blocking navigation or double-animating.
                  */}
                  {children}
                  <Toaster />
                </TooltipProvider>
              </FeedProvider>
            </ClientRoot>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
