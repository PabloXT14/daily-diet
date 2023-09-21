import { MealItem } from './MealItem'

export function DayList() {
  return (
    <article className="space-y-2">
      <strong className="text-lg font-bold text-gray-700">12.08.22</strong>
      <div className="space-y-2">
        <MealItem
          href={`/update/meal`}
          hour="20:00"
          name="X-tudo"
          isDiet={false}
        />
        <MealItem href={`/update/meal`} hour="20:00" name="X-tudo" isDiet />
        <MealItem
          href={`/update/meal`}
          hour="20:00"
          name="Salada de frango com batata"
          isDiet
        />
        <MealItem href={`/update/meal`} hour="20:00" name="X-tudo" isDiet />
      </div>
    </article>
  )
}
