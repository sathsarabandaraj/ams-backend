import { type NextFunction, type Request, type Response } from 'express'
import { JWT_SECRET } from '../configs/env.config'
import { type Roles } from '../enums'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../configs/db.config'
import { User } from '../entities/user.entity'

export const authorize = (allowedRoles: Roles[], allowSelfAccess = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.auth_token
    if (!token) {
      return res.status(401).json({
        message: req.t('auth.unauthorized')
      })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        role: Roles
        systemId: string
        exp?: number
      }

      const currentTime = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({
          message: req.t('auth.tokenExpired')
        })
      }

      // Allow access if the user has a required role
      if (allowedRoles.includes(decoded.role)) {
        req.user = decoded
        next()
        return
      }

      if (allowSelfAccess && req.params.uuid) {
        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOne({
          where: {
            uuid: req.params.uuid
          },
          select: {
            systemId: true
          }
        })
        if (user && user.systemId === decoded.systemId) {
          req.user = decoded
          next()
          return
        }
      }

      return res.status(403).json({
        message: req.t('auth.forbidden')
      })
    } catch (error) {
      return res.status(403).json({
        message: req.t('auth.forbidden')
      })
    }
  }
}
