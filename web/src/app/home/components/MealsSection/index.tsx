'use client'

import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'

import { DayList } from './DayList'
import { NewMeal } from './NewMeal'
import { Meal, MealsByDate } from '@/@types/meal'
import { api } from '@/lib/api'

export function MealsSection() {
  const { data: meals } = useQuery<Meal[]>({
    queryKey: ['meals'],
    queryFn: async () => {
      const response = await api.get('/meals', { withCredentials: true })

      const meals = response.data.meals as Meal[]

      return meals
    },
  })

  const mealsByDate: MealsByDate[] = []

  const sortMealsByDate = () => {
    meals?.forEach((meal) => {
      const date = format(new Date(meal.meal_datetime), 'dd.MM.yyyy')
      const specificDateMeals = mealsByDate.find((meal) => meal.date === date)
      if (!specificDateMeals) {
        mealsByDate.push({
          date,
          meals: [meal],
        })
      } else {
        specificDateMeals.meals.push(meal)
      }
    })
  }

  sortMealsByDate()

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <NewMeal />

      <div className="flex-1 space-y-8 overflow-y-auto pb-[25%] scrollbar-none">
        {mealsByDate.map(({ date, meals }) => (
          <DayList key={date} date={date} meals={meals} />
        ))}
      </div>
    </section>
  )
}
