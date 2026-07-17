import { Outfit } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import BootLoader from "@/components/landing/bootloader";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alethea",
  description: "Alethea AI Bug Tracking Application",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <BootLoader>
              {children}
            </BootLoader>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
