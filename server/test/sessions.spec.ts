import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'

import { app } from '../src/app'

describe('Sessions routes', () => {
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

  describe('POST /sessions/login', () => {
    it('should be able to create a session', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(201)

      const createSessionResponse = await request(app.server)
        .post('/sessions/login')
        .send({
          email: 'johndoe@email.com',
          password: '123456',
        })
        .expect(201)

      expect(createSessionResponse.body).toHaveProperty('session_id')
    })

    it('should not be able to create a session with an invalid email and/or password', async () => {
      const createSessionResponse = await request(app.server)
        .post('/sessions/login')
        .set('Cookie', 'invalid')
        .send({
          email: '',
          password: '',
        })
        .expect(400)

      expect(createSessionResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })

    it('should not be able to create a session with a non-existent email and/or password', async () => {
      const createSessionResponse = await request(app.server)
        .post('/sessions/login')
        .set('Cookie', 'invalid')
        .send({
          email: 'johndoe@email.com',
          password: '123456',
        })
        .expect(401)

      expect(createSessionResponse.body).toEqual(
        expect.objectContaining({
          message: 'Incorrect email or password',
        }),
      )
    })
  })

  describe('POST /sessions/logout', () => {
    it('should be able to clear a session', async () => {
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
        .post('/sessions/logout')
        .set('Cookie', cookies)
        .expect(204)
    })

    it('should not be able to clear a session from an invalid cookie', async () => {
      const invalidCookies = 'invalid'

      const deleteSessionResponse = await request(app.server)
        .post('/sessions/logout')
        .set('Cookie', invalidCookies)
        .expect(401)

      expect(deleteSessionResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })
  })
})
