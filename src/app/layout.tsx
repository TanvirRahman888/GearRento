import type { Metadata } from "next";

import { Geist } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";


import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearRento | Equipment Rental Marketplace",

  description:
    "Rent smarter with GearRento. Find reliable equipment for your next project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.className} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            
            <main className="flex-1">{children}</main>
          </div>

          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
