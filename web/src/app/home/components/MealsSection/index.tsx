import { DayList } from './DayList'
import { NewMeal } from './NewMeal'

export function MealsSection() {
  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <NewMeal />

      <div className="flex-1 space-y-8 overflow-y-auto pb-[25%]">
        <DayList />
        <DayList />
      </div>
    </section>
  )
}
