import Link from 'next/link'
import { ArrowLeft } from '@/assets/icons/phosphor-react'

export const Header = () => {
  return (
    <header className="relative flex w-full items-center justify-center px-6 py-7">
      <Link href="/home" className="absolute left-6">
        <ArrowLeft size={24} className="text-gray-600" />
      </Link>

      <h1 className="text-lg font-bold text-gray-700">Refeição</h1>
    </header>
  )
}
