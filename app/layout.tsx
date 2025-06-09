import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CompanyProvider } from '@/contexts/company-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MaintEdu - Maintenance & Skill Management',
  description: 'Modern maintenance and skill management system for manufacturing companies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CompanyProvider>
          {children}
        </CompanyProvider>
      </body>
    </html>
  )
}