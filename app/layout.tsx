import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from 'geist/font/sans';



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
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
