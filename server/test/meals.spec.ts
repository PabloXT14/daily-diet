import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app'
import { formatDatetimeToUTC } from '../src/utils/format'
import { env } from '../src/env'

const createUser = async () => {
  const createUserResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
      avatar_url: 'https://github.com/johndoe.png',
    })
    .expect(201)
  return createUserResponse
}

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('POST /meals', () => {
    it('should be able to create a meal', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(201)
    })

    it('should not be able to create a meal from a non-existent user', async () => {
      const invalidCookies = 'invalid'

      const createMealResponse = await request(app.server)
        .post('/meals')
        .set('Cookie', invalidCookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(401)

      expect(createMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })

    it('should not be able to create a meal without all the required fields', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const createMealResponse = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({})
        .expect(400)

      expect(createMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })

    it('should not be able to create a meal with invalid data', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const createMealResponse = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 123,
          description: 123,
          meal_datetime: 123,
          is_diet: 123,
        })
        .expect(400)

      expect(createMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })
  })

  describe('GET /meals', () => {
    it('should be able to get all meals from an user', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const firstMealTest = {
        name: 'Meal name test 1',
        description: 'Meal description test 1',
        meal_datetime: '2023-01-01T12:00:00.000Z',
        is_diet: true,
      }

      const secondMealTest = {
        name: 'Meal name test 2',
        description: 'Meal description test 2',
        meal_datetime: '2023-01-02T12:00:00.000Z',
        is_diet: false,
      }

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(firstMealTest)

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(secondMealTest)

      const getMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      expect(getMealsResponse.body.meals).toHaveLength(2)

      expect(getMealsResponse.body).toEqual({
        meals: expect.arrayContaining([
          expect.objectContaining({
            ...firstMealTest,
            meal_datetime: formatDatetimeToUTC(firstMealTest.meal_datetime),
            is_diet: env.DATABASE_CLIENT === 'sqlite' ? 1 : true,
          }),
          expect.objectContaining({
            ...secondMealTest,
            meal_datetime: formatDatetimeToUTC(secondMealTest.meal_datetime),
            is_diet: env.DATABASE_CLIENT === 'sqlite' ? 0 : false,
          }),
        ]),
      })
    })

    it('should not be able to get all meals from a non-existing user', async () => {
      const invalidCookies = 'invalid'

      const getMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', invalidCookies)
        .expect(401)

      expect(getMealsResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })
  })

  describe('GET /meals/:id', () => {
    it('should be able to get a meal', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const firstMealTest = {
        name: 'Meal name test 1',
        description: 'Meal description test 1',
        meal_datetime: '2023-01-01T12:00:00.000Z',
        is_diet: true,
      }

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(firstMealTest)
        .expect(201)

      const firstMealId = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)
        .then((response) => response.body.meals[0].id)

      const getMealResponse = await request(app.server)
        .get(`/meals/${firstMealId}`)
        .set('Cookie', cookies)
        .expect(200)

      expect(getMealResponse.body).toEqual({
        meal: expect.objectContaining({
          ...firstMealTest,
          meal_datetime: formatDatetimeToUTC(firstMealTest.meal_datetime),
          is_diet: env.DATABASE_CLIENT === 'sqlite' ? 1 : true,
        }),
      })
    })

    it('should not be able to get a meal from a non-existing user', async () => {
      const invalidCookies = 'invalid'

      const getMealResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', invalidCookies)
        .expect(401)

      expect(getMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })

    it('should not be able to get a meal from an invalid id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const invalidId = 'invalid'

      const getMealResponse = await request(app.server)
        .get(`/meals/${invalidId}`)
        .set('Cookie', cookies)
        .expect(400)

      expect(getMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })

    it('should not be able to get a meal from a non-existing id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const randomId = randomUUID()

      const getMealResponse = await request(app.server)
        .get(`/meals/${randomId}`)
        .set('Cookie', cookies)
        .expect(404)

      expect(getMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Meal not found',
        }),
      )
    })
  })

  describe('PUT /meals/:id', () => {
    it('should be able to update a meal', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(201)

      const firstMealId = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)
        .then((response) => response.body.meals[0].id)

      await request(app.server)
        .put(`/meals/${firstMealId}`)
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test updated',
          description: 'Meal description test updated',
          meal_datetime: '2023-01-02T12:00:00.000Z',
          is_diet: false,
        })
        .expect(204)
    })

    it('should not be able to update a meal from a non-existing user', async () => {
      const invalidCookies = 'invalid'

      const randomId = randomUUID()

      const updateMealResponse = await request(app.server)
        .put(`/meals/${randomId}`)
        .set('Cookie', invalidCookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(401)

      expect(updateMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })

    it('should not be able to update a meal from an invalid id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const invalidId = 'invalid'

      const updateMealResponse = await request(app.server)
        .put(`/meals/${invalidId}`)
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(400)

      expect(updateMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })

    it('should not be able to update a meal from a non-existing id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const randomId = randomUUID()

      const updateMealResponse = await request(app.server)
        .put(`/meals/${randomId}`)
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(404)

      expect(updateMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Meal not found',
        }),
      )
    })

    it('should not be able to update a meal with invalid data', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(201)

      const firstMealId = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)
        .then((response) => response.body.meals[0].id)

      const updateMealResponse = await request(app.server)
        .put(`/meals/${firstMealId}`)
        .set('Cookie', cookies)
        .send({
          name: 1234,
          description: 1234,
          meal_datetime: 1234,
          is_diet: 1234,
        })
        .expect(400)

      expect(updateMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })

    it('should not be able to update a meal with all the fields empty', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(201)

      const firstMealId = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)
        .then((response) => response.body.meals[0].id)

      const updateMealResponse = await request(app.server)
        .put(`/meals/${firstMealId}`)
        .set('Cookie', cookies)
        .send({})
        .expect(400)

      expect(updateMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })
  })

  describe('DELETE /meals/:id', () => {
    it('should be able to delete a meal', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'Meal name test',
          description: 'Meal description test',
          meal_datetime: '2023-01-01T12:00:00.000Z',
          is_diet: true,
        })
        .expect(201)

      const firstMealId = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)
        .then((response) => response.body.meals[0].id)

      await request(app.server)
        .delete(`/meals/${firstMealId}`)
        .set('Cookie', cookies)
        .expect(204)
    })

    it('should not be able to delete a meal from a non-existing user', async () => {
      const invalidCookies = 'invalid'

      const randomId = randomUUID()

      const deleteMealResponse = await request(app.server)
        .delete(`/meals/${randomId}`)
        .set('Cookie', invalidCookies)
        .expect(401)

      expect(deleteMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })

    it('should not be able to delete a meal from an invalid id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const invalidId = 'invalid'

      const deleteMealResponse = await request(app.server)
        .delete(`/meals/${invalidId}`)
        .set('Cookie', cookies)
        .expect(400)

      expect(deleteMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })

    it('should not be able to delete a meal from a non-existing id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const randomId = randomUUID()

      const deleteMealResponse = await request(app.server)
        .delete(`/meals/${randomId}`)
        .set('Cookie', cookies)
        .expect(404)

      expect(deleteMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Meal not found',
        }),
      )
    })
  })

  describe('GET /meals/summary', () => {
    it('should be able to get a summary of meals', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const firstMeal = {
        name: 'Meal name test 1',
        description: 'Meal description test 1',
        meal_datetime: '2023-01-01T12:00:00.000Z',
        is_diet: true,
      }

      const secondMeal = {
        name: 'Meal name test 2',
        description: 'Meal description test 2',
        meal_datetime: '2023-01-02T12:00:00.000Z',
        is_diet: false,
      }

      const thirdMeal = {
        name: 'Meal name test 3',
        description: 'Meal description test 3',
        meal_datetime: '2023-01-03T12:00:00.000Z',
        is_diet: false,
      }

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(firstMeal)
        .expect(201)

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(secondMeal)
        .expect(201)

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(thirdMeal)
        .expect(201)

      const getSummaryResponse = await request(app.server)
        .get('/meals/summary')
        .set('Cookie', cookies)
        .expect(200)

      expect(getSummaryResponse.body).toEqual({
        summary: expect.objectContaining({
          total_meals: 3,
          meals_in_diet: 1,
          meals_out_of_diet: 2,
          best_diet_sequence: 1,
        }),
      })
    })

    it('should not be able to get a summary of meals from a non-existing user', async () => {
      const invalidCookies = 'invalid'

      const getSummaryResponse = await request(app.server)
        .get('/meals/summary')
        .set('Cookie', invalidCookies)
        .expect(401)

      expect(getSummaryResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })
  })
})
