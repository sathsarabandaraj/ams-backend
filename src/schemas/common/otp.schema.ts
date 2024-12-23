import { z } from 'zod'

export const OTPSchema = z
  .string()
  .min(6, 'zod.schema.otpRequired')
  .max(6, 'zod.schema.otpRequired')
  .trim()
