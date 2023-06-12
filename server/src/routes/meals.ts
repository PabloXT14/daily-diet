import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { MealSchema, MealType } from '../schemas/meal-schema'
import { AppError } from '../utils/AppError'
import { formatMealDate, formatMealTime } from '../utils/format'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)

  app.get('/', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('user').first().where({ session_id: sessionId })

    const meals = await knex('meal')
      .select('*')
      .where({ user_id: user?.id })
      .orderBy('created_at', 'desc')
      .then((data: MealType[]) => {
        const formattedMeals = data.map((meal) => {
          return {
            ...meal,
            meal_date: formatMealDate(meal.meal_date),
            meal_time: formatMealTime(meal.meal_time),
          }
        })
        return formattedMeals
      })

    return reply.status(200).send({ meals })
  })

  app.get('/:id', async (request, reply) => {
    const { sessionId } = request.cookies

    const paramsSchema = MealSchema.pick({
      id: true,
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await knex('user').first().where({ session_id: sessionId })

    const meal = await knex('meal')
      .first()
      .where({ id, user_id: user?.id })
      .then((_meal) => {
        if (!_meal) throw new AppError('Meal not found', 404)

        const formattedMeal = {
          ..._meal,
          meal_date: formatMealDate(_meal.meal_date),
          meal_time: formatMealTime(_meal.meal_time),
        }

        return formattedMeal
      })

    if (!meal) throw new AppError('Meal not found', 404)

    return reply.status(200).send({ meal })
  })

  app.post('/', async (request, reply) => {
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
  })

  app.put('/:id', async (request, reply) => {
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
          message: 'You need to inform at least one valid field to update',
        },
      )

    const { id } = paramsSchema.parse(request.params)
    const { name, description, meal_date, meal_time, is_diet } =
      bodySchema.parse(request.body)

    const user = await knex('user').first().where({ session_id: sessionId })

    const mealExists = await knex('meal')
      .first()
      .where({ id, user_id: user?.id })

    if (!mealExists) throw new AppError('Meal not found', 404)

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
  })

  app.delete('/:id', async (request, reply) => {
    const { sessionId } = request.cookies

    const paramsSchema = MealSchema.pick({
      id: true,
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await knex('user').first().where({ session_id: sessionId })

    const mealExists = await knex('meal')
      .first()
      .where({ id, user_id: user?.id })

    if (!mealExists) throw new AppError('Meal not found', 404)

    await knex('meal').delete().where({ id, user_id: user?.id })

    return reply.status(204).send()
  })

  app.get('/summary', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('user').first().where({ session_id: sessionId })

    const totalMeals = await knex('meal')
      .count()
      .where({ user_id: user?.id })
      .then((data) => Number(data[0].count))

    const mealsInDiet = await knex('meal')
      .count()
      .where({ is_diet: true, user_id: user?.id })
      .then((data) => Number(data[0].count))

    const mealsOutOfDiet = await knex('meal')
      .count()
      .where({ is_diet: false, user_id: user?.id })
      .then((data) => Number(data[0].count))

    const bestDietSequence = await knex
      .raw(
        `
      SELECT COUNT(*) AS sequence_count
      FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY meal_date ASC) AS row_number, meal_date
        FROM meal
        WHERE is_diet = true AND user_id = '${user?.id}'
      ) AS sequence
      GROUP BY meal_date - row_number
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `,
      )
      .then((data) => {
        if (data.length > 0) {
          return Number(data[0].sequence_count)
        } else {
          return 0
        }
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
