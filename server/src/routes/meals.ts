import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { MealSchema } from '../schemas/meal-schema'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('user').first().where({ session_id: sessionId })

      const meals = await knex('meal').select('*').where({ user_id: user?.id })

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
}
