import { z } from 'zod'
import { isValid, parseISO, parse } from 'date-fns'

export const MealSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  meal_date: z.string().refine(
    (value) => {
      const parsedDate = parseISO(value)
      return isValid(parsedDate)
    },
    {
      message: 'Invalid date format (yyyy-mm-dd)',
    },
  ),
  meal_time: z.string().refine(
    (value) => {
      const parsedTime = parse(value, 'HH:mm', new Date())
      return isValid(parsedTime)
    },
    {
      message: 'Invalid time format (HH:mm)',
    },
  ),
  is_diet: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string().uuid(),
})

export type MealType = z.infer<typeof MealSchema>
