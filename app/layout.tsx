import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import logo from "@/images/logo-megan.png"
import './globals.css'

export const metadata: Metadata = {
  title: 'Pracownia MEGAN — Angielski, który sprawia frajdę',
  description: 'Kameralne zajęcia językowe dla wszystkich grup wiekowych. Mów po angielsku swobodniej, odważniej i bez szkolnego zadęcia.',
  generator: 'v0.app',
  icons: {
    icon: logo.src,
    apple: logo.src,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f0e7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
