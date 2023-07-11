import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'

const nunito_sans = Nunito_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: 'Daily Diet',
  description: 'Crie uma dieta diária para você',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito_sans.className} bg-zinc-950 text-white`}>{children}</body>
    </html>
  )
}
