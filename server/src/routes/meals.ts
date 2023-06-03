import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { format } from 'date-fns'

import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { MealSchema, MealType } from '../schemas/meal-schema'
import { AppError } from '../utils/AppError'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('user').first().where({ session_id: sessionId })

      const meals = await knex('meal')
        .select('*')
        .where({ user_id: user?.id })
        .orderBy('created_at', 'desc')
        .then((data: MealType[]) => {
          const formattedMeals = data.map((meal) => {
            const [hours, minutes, seconds] = meal.meal_time.split(':')

            const time = new Date()
            time.setHours(Number(hours))
            time.setMinutes(Number(minutes))
            time.setSeconds(Number(seconds))

            return {
              ...meal,
              meal_date: format(new Date(meal.meal_date), 'yyyy-MM-dd'),
              meal_time: format(time, 'HH:mm'),
            }
          })
          return formattedMeals
        })

      return reply.status(200).send({ meals })
    },
  )

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const bodySchema = MealSchema.pick({
        name: true,
        description: true,
        meal_date: true,
        meal_time: true,
        is_diet: true,
      })

      const { name, description, meal_date, meal_time, is_diet } =
        bodySchema.parse(request.body)

      const user = await knex('user').first().where({ session_id: sessionId })

      // console.log(meal_date)

      await knex('meal').insert({
        id: randomUUID(),
        name,
        description,
        meal_date,
        meal_time,
        is_diet,
        user_id: user?.id,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const paramsSchema = MealSchema.pick({
        id: true,
      })

      const bodySchema = MealSchema.pick({
        name: true,
        description: true,
        meal_date: true,
        meal_time: true,
        is_diet: true,
      })
        .partial()
        .refine(
          (obj) => {
            const isEmpty = Object.keys(obj).length <= 0
            return !isEmpty
          },
          {
            message: 'The body must not be empty',
          },
        )

      const { id } = paramsSchema.parse(request.params)
      const { name, description, meal_date, meal_time, is_diet } =
        bodySchema.parse(request.body)

      const mealExists = await knex('meal').first().where({ id })

      if (!mealExists) throw new AppError('Meal not found', 404)

      const user = await knex('user').first().where({ session_id: sessionId })

      await knex('meal')
        .update({
          name,
          description,
          meal_date,
          meal_time,
          is_diet,
          updated_at: knex.fn.now(),
        })
        .where({
          id,
          user_id: user?.id,
        })

      return reply.status(204).send()
    },
  )
}
