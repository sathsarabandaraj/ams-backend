import { z } from 'zod'
import { CivilStatus } from '../enums'
import { ContactInfoSchema } from './contact-info.schema'
import { BankDetailsSchema } from './bank-details.schema'
import { UserSchema } from './user.schema'

const StaffDataSchema = z.object({
  postalCode: z.string().min(1, 'zod.schema.postalCodeRequired').trim(),
  nicNo: z.string().min(1, 'zod.schema.nicNoRequired').max(12).trim(),
  nicFrontUrl: z.string().url('zod.schema.nicFrontUrlRequired').trim(),
  nicBackUrl: z.string().url('zod.schema.nicBackUrlRequired').trim(),
  civilStatus: z.nativeEnum(CivilStatus),
  secondaryContact: ContactInfoSchema.strict().optional(),
  bankDetails: BankDetailsSchema.strict().optional(),
  isAdmin: z.boolean().optional(),
  isTeacher: z.boolean().optional(),
  hasApprovedInformation: z.boolean().optional()
})

export const StaffSchema = z.object({
  user: UserSchema.extend({
    staff: StaffDataSchema.strict()
  }).strict()
})

export const UpdateStaffSchema = z.object({
  user: UserSchema.partial()
    .extend({
      staff: StaffDataSchema.deepPartial().strict()
    })
    .strict()
})
