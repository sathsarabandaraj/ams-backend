import { Router } from 'express'
import { loginOTPHandler, logoutHandler, verifyOTPHandler, getMeHandler } from '../controllers/auth.controller'
import { requestBodyValidator } from '../middlewares/request-validator.middleware'
import { LoginSchema, OTPVerificationSchema } from '../schemas/auth.schemas'
import passport from 'passport'

const router = Router()

router.post('/login', requestBodyValidator(LoginSchema), loginOTPHandler)
router.post(
  '/verify',
  requestBodyValidator(OTPVerificationSchema),
  verifyOTPHandler
)
router.post('/logout', logoutHandler)

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  getMeHandler
)

export default router
