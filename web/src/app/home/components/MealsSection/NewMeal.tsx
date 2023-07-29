import { Plus } from '@/assets/icons/phosphor-react'
import { Button } from '@/components/Button'
import Link from 'next/link'

export function NewMeal() {
  return (
    <div className="mb-8 space-y-2">
      <span className="text-base text-gray-700">Refeições</span>
      <Link href="/register/meal">
        <Button className="w-full">
          <Plus size={18} />
          Nova refeição
        </Button>
      </Link>
    </div>
  )
}
