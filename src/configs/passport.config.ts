import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { type PassportStatic } from 'passport'
import { JWT_SECRET } from './env.config'
import { AppDataSource } from './db.config'
import { User } from '../entities/user.entity'
import i18next from 'i18next'
import { type Request } from 'express'

const cookieExtractor = (req: Request): string | null => {
  if (req?.cookies) {
    return req.cookies.auth_token || null
  }
  return null
}

export const configurePassport = (passport: PassportStatic): void => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET
  }

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done): Promise<void> => {
      try {
        const currentTime = Math.floor(Date.now() / 1000)

        if (jwtPayload.exp && jwtPayload.exp < currentTime) {
          done(null, false, {
            message: i18next.t('auth.tokenExpired')
          })
          return
        }

        const userRepository = AppDataSource.getRepository(User)

        // Check if user exists
        const user = await userRepository.findOne({
          where: { systemId: jwtPayload.systemId }
        })

        if (!user) {
          done(null, false, {
            message: i18next.t('auth.unauthorized')
          })
          return
        }

        // Attach user details to req.user
        done(null, jwtPayload)
      } catch (err) {
        done(err, false)
      }
    })
  )
}
