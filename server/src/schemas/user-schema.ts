import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar_url: z.string().url().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  session_id: z.string().uuid(),
})

export type UserType = z.infer<typeof UserSchema>
