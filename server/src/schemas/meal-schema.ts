import { z } from 'zod'
import { isValid, parseISO } from 'date-fns'

export const MealSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  meal_datetime: z.string().refine(
    (datetime) => {
      const parsedDate = parseISO(datetime)
      return isValid(parsedDate)
    },
    {
      message:
        'Invalid date, must be on ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
    },
  ),
  is_diet: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string().uuid(),
})

export type MealType = z.infer<typeof MealSchema>
