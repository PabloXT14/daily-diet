// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'
import { MealType } from '../schemas/meal-schema'
import { UserType } from '../schemas/user-schema'

declare module 'knex/types/tables' {
  export interface Tables {
    user: UserType
    meal: MealType
  }
}
