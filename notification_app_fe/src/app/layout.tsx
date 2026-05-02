import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppThemeProvider from "@/components/AppThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notification System",
  description: "Notification System frontend built with Next.js and Material UI"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
