import { Router } from 'express'
import {
  loginOTPHandler,
  logoutHandler,
  verifyOTPHandler
} from '../controllers/auth.controller'
import { requestBodyValidator } from '../middlewares/request-validator.middleware'
import { LoginSchema, OTPVerificationSchema } from '../schemas/auth.schemas'
import { nextTick } from 'process'

const router = Router()

router.post('/login', requestBodyValidator(LoginSchema), loginOTPHandler)
router.post(
  '/verify',
  requestBodyValidator(OTPVerificationSchema),
  verifyOTPHandler
)
router.post('/logout', logoutHandler)

export default router
