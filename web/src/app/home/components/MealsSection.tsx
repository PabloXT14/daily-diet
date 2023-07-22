import { Plus } from '@/assets/icons/phosphor-react'
import { Button } from '@/components/Button'
import { MealItem } from './MealItem'
import { DayList } from './DayList'

export function MealsSection() {
  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <div className="mb-8 space-y-2">
        <span className="text-base text-gray-700">Refeições</span>
        <Button className="w-full">
          <Plus size={18} />
          Nova refeição
        </Button>
      </div>

      <div className="mb-9 flex-1 space-y-8 overflow-y-auto">
        <DayList />
        <DayList />
      </div>
    </section>
  )
}
