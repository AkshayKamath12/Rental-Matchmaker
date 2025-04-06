import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignIn
} from '@clerk/nextjs'
import { hash } from "crypto";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentMatch",
  description: "Find the best matches for local properties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body>
            {children}
        </body>
      </html>
  )
}