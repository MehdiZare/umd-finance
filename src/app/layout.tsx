import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bond Duration Calculator - UMD Finance',
  description: 'Interactive educational tool for Master of Finance students to learn about bond duration, convexity, and fixed income analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
