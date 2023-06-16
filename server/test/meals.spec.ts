import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app'

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
      const createUserResponse = await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(201)

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
      const createUserResponse = await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(201)

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
})
