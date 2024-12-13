import { type Request, type Response } from 'express'
import { loginOTP, verifyOTP } from '../services/auth.service'
import { NODE_ENV } from '../configs/env.config'
import { type IApiResult } from '../types'

export const loginOTPHandler = async (
  req: Request,
  res: Response
): Promise<IApiResult<unknown>> => {
  try {
    const { systemId, password } = req.body

    const feedback = await loginOTP(systemId, password)

    return res.status(feedback.statusCode).json({
      message: req.t(feedback.message ?? 'default.message')
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: req.t(error.name),
        message: req.t(error.message)
      })
    }

    throw error
  }
}

export const verifyOTPHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { systemId, otp } = req.body

    const feedback = await verifyOTP(systemId, otp)

    if (feedback.statusCode === 200 && feedback.data) {
      // Set the JWT as an HTTP-only cookie
      res.cookie('auth_token', feedback.data, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'none', // TODO: Set to 'strict' when the frontend is on the same domain
        maxAge: 1000 * 60 * 60 * 24 * 1
      })
    }

    return res.status(feedback.statusCode).json({
      message: req.t(feedback.message ?? 'default.message')
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: req.t(error.name),
        message: req.t(error.message)
      })
    }

    throw error
  }
}

export const logoutHandler = (req: Request, res: Response): void => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'none' // TODO: Set to 'strict' when the frontend is on the same domain
  })
  res.status(200).end()
}
