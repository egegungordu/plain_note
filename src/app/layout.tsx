import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "./(sidebar)/sidebar";
import Listbar from "./(listbar)/listbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions";
import AuthProvider from "@/components/nextauthprovider";
import ReduxProvider from "@/components/reduxprovider";

export const metadata: Metadata = {
  title: "Plain Note",
  description: "A simple note taking app",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${inter.variable} overflow-y-hidden font-sans bg-black flex h-screen`}
      >
        <ReduxProvider>
          <AuthProvider session={session}>
            <Sidebar />
            <Listbar />
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
