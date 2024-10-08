import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import PropertyBookingDashboard from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { isUserAuthenticated } from "@/lib/userMapper";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Innmate",
  description: "dwell into the world of booking",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const isUser = await isUserAuthenticated();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PropertyBookingDashboard />
        <hr className="w-screen border-t border-secondary-foreground/20 m-0" />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
