import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/shared/Navbar/Navbar";
import Footer from "./Components/shared/Footer/Footer";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNook",
  description: "A Small Online Library",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <Suspense fallback={<div className="h-20" />}>
          <Navbar />
        </Suspense>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer/>
        </body>
    </html>
  );
}
