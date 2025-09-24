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
  description: "Welcome to IDA Nagpur - The official website of the Indian Dentist Association, Nagpur. Explore our events, membership, and resources for architects and designers in Nagpur.",
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
