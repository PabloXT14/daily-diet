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

    it('should not be able to create a meal without a valid sessionId', async () => {
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
  })

  describe('GET /meals', () => {
    it('should be able to get all meals from a user', async () => {
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

  describe.only('GET /meals/:id', () => {
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

    it('should not be able to get a meal from a invalid id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const invalidId = 'invalid'

      await request(app.server)
        .get(`/meals/${invalidId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to get a meal from a non-existing id', async () => {
      const createUserResponse = await createUser()

      const cookies = createUserResponse.get('Set-Cookie')

      const randomId = randomUUID()

      await request(app.server)
        .get(`/meals/${randomId}`)
        .set('Cookie', cookies)
        .expect(404)
    })
  })
})
