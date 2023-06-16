import { describe, it, afterAll, beforeAll, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('POST /users', () => {
    it('should be able to create a user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(201)
    })

    it('should not be able to create a user with an existing email', async () => {
      await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
        avatar_url: 'https://github.com/johndoe.png',
      })

      await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(400)
    })

    it('should not be able to create a user without all the required fields', async () => {
      await request(app.server).post('/users').send({}).expect(400)
    })

    it('should return sessionId in response cookies', async () => {
      const createUserResponse = await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(201)

      const [sessionId] = createUserResponse.get('Set-Cookie')

      expect(sessionId).toBeDefined()
    })
  })

  describe('GET /users', () => {
    it('should be able to get an existing user', async () => {
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

      const getUserResponse = await request(app.server)
        .get('/users')
        .set('Cookie', cookies)
        .expect(200)

      expect(getUserResponse.body.user).toEqual(
        expect.objectContaining({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        }),
      )
    })

    it('should not be able to get an non-existing user', async () => {
      const getUserResponse = await request(app.server).get('/users')

      expect(getUserResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })
  })

  describe('PUT /users', () => {
    it('should be able to update an existing user', async () => {
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
        .put('/users')
        .set('Cookie', cookies)
        .send({
          name: 'John Doe updated',
          email: 'johndoeupdated@email.com',
          password: '654321',
          avatar_url: 'https://github.com/johndoeupdated.png',
        })
        .expect(204)
    })

    it('should not be able to update an non-existing user', async () => {
      const updateUserResponse = await request(app.server).put('/users').send({
        name: 'John Doe updated',
        email: 'johndoeupdated@email.com',
        password: '654321',
        avatar_url: 'https://github.com/johndoeupdated.png',
      })

      expect(updateUserResponse.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      )
    })

    it('should not be able to update an existing user without at least one field', async () => {
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

      const updateUserResponse = await request(app.server)
        .put('/users')
        .set('Cookie', cookies)
        .send({})
        .expect(400)

      expect(updateUserResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error',
        }),
      )
    })
  })
})
