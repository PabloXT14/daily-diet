export type Meal = {
  id: string
  name: string
  description: string
  meal_datetime: Date
  is_diet: boolean
  created_at: Date
  updated_at: Date
  user_id: string
}

export type MealsSummary = {
  total_meals: number
  meals_in_diet: number
  meals_out_of_diet: number
  best_diet_sequence: number
}

export type MealsByDate = {
  date: string
  meals: Meal[]
}
