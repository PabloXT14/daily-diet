import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { ReactNode } from 'react'

const nunito_sans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nunito-sans',
})

export const metadata: Metadata = {
  title: 'Daily Diet',
  description: 'Crie uma dieta diária para você',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${nunito_sans.variable} bg-gray-100 font-sans text-gray-600`}
      >
        {children}
      </body>
    </html>
  )
}
