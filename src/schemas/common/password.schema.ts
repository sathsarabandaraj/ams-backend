import { z } from 'zod'

export const PassowrdSchema = z
  .string()
  .trim()
  .min(8, 'zod.schema.passwordMinLength')
  .max(32, 'zod.schema.passwordMaxLength')
  .regex(/(?=.*[a-z])/, 'zod.schema.passwordLowercaseRequired')
  .regex(/(?=.*[A-Z])/, 'zod.schema.passwordUppercaseRequired')
  .regex(/(?=.*\d)/, 'zod.schema.passwordNumberRequired')
  .regex(/(?=.*[@$!%*?&])/, 'zod.schema.passwordSpecialCharRequired')
