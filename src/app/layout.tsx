import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from './(sidebar)/sidebar'
import Listbar from './(listbar)/listbar'

export const metadata: Metadata = {
  title: 'Plain Note',
  description: 'A simple note taking app'
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-black flex min-h-screen`}
      >
        <Sidebar />
        <Listbar />
        {children}
      </body>
    </html>
  )
}
