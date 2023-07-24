import Link from 'next/link'

import { ArrowLeft } from '@/assets/icons/phosphor-react'

export function PercentSection() {
  return (
    <header className="flex w-full flex-col px-6">
      <Link href="/" className="self-start">
        <ArrowLeft className="text-green-dark" size={24} />
      </Link>

      <div className="mb-9 flex flex-col items-center justify-center">
        <strong className="text-3xl font-bold text-gray-700">90,86%</strong>
        <span className="text-sm text-gray-600">
          das refeições dentro da dieta
        </span>
      </div>
    </header>
  )
}
