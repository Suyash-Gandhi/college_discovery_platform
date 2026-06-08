import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "CollegeDiscover — Find Your Perfect College",
  description:
    "Search, compare, and save colleges across India. Filter by fee, rating, location, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
