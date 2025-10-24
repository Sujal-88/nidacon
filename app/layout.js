import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IDA Nagpur",
  description: "The Nagpur Branch of the Indian Dental Association (IDA) is dedicated to advancing dental health and education. Join us in our mission to promote excellence in dentistry and community well-being.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body

        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
      <Navbar />
      
      
        {children}
      </body>
    </html>
  );
}
