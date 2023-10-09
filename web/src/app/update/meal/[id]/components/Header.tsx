'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@/assets/icons/phosphor-react'

export function Header() {
  const router = useRouter()

  function handleBack() {
    router.back()
  }

  return (
    <header className="relative flex w-full items-center justify-center px-6 py-7">
      <button onClick={() => handleBack()} className="absolute left-6">
        <ArrowLeft size={24} className="text-gray-600" />
      </button>

      <h1 className="text-lg font-bold text-gray-700">Editar refeição</h1>
    </header>
  )
}
