import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { knex } from '../database'
import { MealSchema } from '../schemas/meal-schema'
import { AppError } from '../utils/app-error'
import { formatDatetimeToUTC } from '../utils/format'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', ensureAuthenticated)

  app.get('/', async (request, reply) => {
    const { id: user_id } = request.user

    const meals = await knex('meals')
      .select('*')
      .where({ user_id })
      .orderBy('meal_datetime', 'desc')

    return reply.status(200).send({ meals })
  })

  app.get('/:id', async (request, reply) => {
    const { id: user_id } = request.user

    const paramsSchema = MealSchema.pick({
      id: true,
    })

    const { id } = paramsSchema.parse(request.params)

    const meal = await knex('meals').first().where({ id, user_id })

    if (!meal) throw new AppError('Meal not found', 404)

    return reply.status(200).send({ meal })
  })

  app.post('/', async (request, reply) => {
    const { id: user_id } = request.user

    const bodySchema = MealSchema.pick({
      name: true,
      description: true,
      meal_datetime: true,
      is_diet: true,
    })

    const { name, description, meal_datetime, is_diet } = bodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      meal_datetime: formatDatetimeToUTC(meal_datetime),
      is_diet,
      user_id,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const { id: user_id } = request.user

    const paramsSchema = MealSchema.pick({
      id: true,
    })

    const bodySchema = MealSchema.pick({
      name: true,
      description: true,
      meal_datetime: true,
      is_diet: true,
    })
      .partial()
      .refine(
        (body) => {
          const isEmpty = Object.keys(body).length <= 0
          return !isEmpty
        },
        {
          message: 'You need to inform at least one valid field to update',
        },
      )

    const { id } = paramsSchema.parse(request.params)
    const { name, description, meal_datetime, is_diet } = bodySchema.parse(
      request.body,
    )

    const mealExists = await knex('meals').first().where({ id, user_id })

    if (!mealExists) throw new AppError('Meal not found', 404)

    await knex('meals')
      .update({
        name,
        description,
        meal_datetime: meal_datetime
          ? formatDatetimeToUTC(meal_datetime)
          : meal_datetime,
        is_diet,
        updated_at: knex.fn.now(),
      })
      .where({
        id,
        user_id,
      })

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const { id: user_id } = request.user

    const paramsSchema = MealSchema.pick({
      id: true,
    })

    const { id } = paramsSchema.parse(request.params)

    const mealExists = await knex('meals').first().where({ id, user_id })

    if (!mealExists) throw new AppError('Meal not found', 404)

    await knex('meals').delete().where({ id, user_id })

    return reply.status(204).send()
  })

  app.get('/summary', async (request, reply) => {
    const { id: user_id } = request.user

    const totalMeals = await knex('meals')
      .count('*', { as: 'count' })
      .where({ user_id })
      .then((data) => Number(data[0].count))

    const mealsInDiet = await knex('meals')
      .count('*', { as: 'count' })
      .where({ is_diet: true, user_id })
      .then((data) => Number(data[0].count))

    const mealsOutOfDiet = await knex('meals')
      .count('*', { as: 'count' })
      .where({ is_diet: false, user_id })
      .then((data) => Number(data[0].count))

    const bestDietSequence = await knex('meals')
      .select('*')
      .where({ user_id })
      .orderBy('meal_datetime', 'desc')
      .then((meals) => {
        let bestDietSequence = 0
        let currentBestDietSequence = 0

        meals.forEach((meal) => {
          if (meal.is_diet) {
            currentBestDietSequence++
            if (currentBestDietSequence > bestDietSequence) {
              bestDietSequence = currentBestDietSequence
            }
          } else {
            if (currentBestDietSequence > bestDietSequence) {
              bestDietSequence = currentBestDietSequence
            }
            currentBestDietSequence = 0
          }
        })

        return bestDietSequence
      })

    const summary = {
      total_meals: totalMeals,
      meals_in_diet: mealsInDiet,
      meals_out_of_diet: mealsOutOfDiet,
      best_diet_sequence: bestDietSequence,
    }

    return reply.status(200).send({ summary })
  })
}
