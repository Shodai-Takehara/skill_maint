import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CompanyProvider } from '@/contexts/company-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MaintEdu - 保守・スキル管理システム',
  description: '製造業向けモダン保守・スキル管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <CompanyProvider>
          {children}
        </CompanyProvider>
      </body>
    </html>
  )
}