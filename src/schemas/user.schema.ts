import { z } from 'zod'
import { Gender, AccoutStatus, UserType } from '../enums'

export const UserSchema = z.object({
  email: z.string().email('zod.schema.invalidEmailFormat'),
  nameInFull: z.string().min(1, 'zod.schema.fullnameRequired').trim(),
  firstName: z.string().min(1, 'zod.schema.firstNameRequired').trim(),
  lastName: z.string().min(1, 'zod.schema.lastNameRequired').trim(),
  address: z.string().min(1, 'zod.schema.addressRequired').trim(),
  contactNo: z
    .string()
    .min(10, 'zod.schema.phoneNumberMinLength')
    .max(15, 'zod.schema.phoneNumberMaxLength')
    .regex(/^\d+$/, 'zod.schema.phoneNumberDigitsOnly'), // Ensures only digits
  gender: z.nativeEnum(Gender),
  dob: z
    .string()
    .refine((str) => !isNaN(Date.parse(str)), 'zod.schema.dobInvalidFormat')
    .transform((str) => new Date(str))
    .refine((date) => date < new Date(), 'zod.schema.dobInThePast'),
  password: z
    .string()
    .min(8, 'zod.schema.passwordMinLength')
    .max(32, 'zod.schema.passwordMaxLength')
    .regex(/(?=.*[a-z])/, 'zod.schema.passwordLowercaseRequired')
    .regex(/(?=.*[A-Z])/, 'zod.schema.passwordUppercaseRequired')
    .regex(/(?=.*\d)/, 'zod.schema.passwordNumberRequired')
    .regex(/(?=.*[@$!%*?&])/, 'zod.schema.passwordSpecialCharRequired'),
  accountStatus: z.nativeEnum(AccoutStatus),
  userType: z.nativeEnum(UserType),
  mainCenter: z.string().uuid('Invalid Center ID').optional()
})
