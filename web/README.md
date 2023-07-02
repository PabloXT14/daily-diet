## Cálculo para organizar refeições por data
```ts
interface MealsByDate {
  date: string
  meals: MealType[]
}

const mealsByDate: MealsByDate[] = []

    meals.forEach((meal) => {
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
```