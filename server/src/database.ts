import { Knex, knex as setupKnex } from 'knex'
import * as dotenv from 'dotenv'
dotenv.config()

export const config: Knex.Config = {
  client: process.env.DATABASE_CLIENT,
  connection:
    process.env.DATABASE_CLIENT === 'pg'
      ? process.env.DATABASE_URL
      : {
          filename: process.env.DATABASE_URL!,
        },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  useNullAsDefault: true,
}

export const knex = setupKnex(config)
