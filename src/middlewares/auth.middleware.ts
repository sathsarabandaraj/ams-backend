import { type NextFunction, type Request, type Response } from 'express'
import { JWT_SECRET } from '../configs/env.config'
import { type Roles } from '../enums'
import jwt from 'jsonwebtoken'

export const authorize = (allowedRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.auth_token
    if (!token) {
      return res.status(401).json({
        message: req.t('auth.unauthorized')
      })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        role: Roles
        exp?: number
      }

      // Check if the token has expired
      const currentTime = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({
          message: req.t('auth.tokenExpired')
        })
      }

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message: req.t('auth.forbidden')
        })
      }

      req.user = decoded
      next()
    } catch (error) {
      return res.status(403).json({
        message: req.t('auth.forbidden')
      })
    }
  }
}
