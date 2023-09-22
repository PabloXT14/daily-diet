import { MealItem } from './MealItem'

export function DayList() {
  return (
    <article className="space-y-2">
      <strong className="text-lg font-bold text-gray-700">12.08.22</strong>
      <div className="space-y-2">
        <MealItem
          href={`/meal/${'001'}`}
          hour="20:00"
          name="X-tudo"
          isDiet={false}
        />
        <MealItem href={`/meal/${'002'}`} hour="20:00" name="X-tudo" isDiet />
        <MealItem
          href={`/meal/${'003'}`}
          hour="20:00"
          name="Salada de frango com batata"
          isDiet
        />
        <MealItem href={`/meal/${'004'}`} hour="20:00" name="X-tudo" isDiet />
      </div>
    </article>
  )
}
