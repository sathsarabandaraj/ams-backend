import { z } from 'zod'
import { SystemIDSchema } from './common/systemId.schema'
import { OTPSchema } from './common/otp.schema'
import { PassowrdSchema } from './common/password.schema'

export const LoginSchema = z.object({
  systemId: SystemIDSchema,
  password: PassowrdSchema
})

export const OTPVerificationSchema = z.object({
  systemId: SystemIDSchema,
  otp: OTPSchema
})
