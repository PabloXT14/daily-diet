import { MealsByDate } from '@/@types/meal'
import { MealItem } from './MealItem'

type DayListProps = MealsByDate

export function DayList({ date, meals }: DayListProps) {
  return (
    <article className="space-y-2">
      <strong className="text-lg font-bold text-gray-700">{date}</strong>
      <div className="space-y-2">
        {meals.map((meal) => (
          <MealItem key={meal.id} href={`/meal/${meal.id}`} meal={meal} />
        ))}
      </div>
    </article>
  )
}
