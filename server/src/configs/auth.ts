import { Secret, SignOptions } from 'jsonwebtoken'
import { env } from '../env'

type JwtConfig = SignOptions & {
  secret: Secret
}

const jwtConfig: JwtConfig = {
  secret: env.JWT_SECRET as Secret,
  expiresIn: '1d',
}

export { jwtConfig }
