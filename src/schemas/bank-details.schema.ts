import { z } from 'zod'

export const BankDetailsSchema = z
  .object({
    accountHolderName: z
      .string()
      .min(1, 'zod.schema.accountHolderRequired')
      .trim(),
    accountNo: z.string().min(1, 'zod.schema.accountNoRequired').trim(),
    bankName: z.string().min(1, 'zod.schema.bankNameRequired').trim(),
    branchName: z.string().min(1, 'zod.schema.branchNameRequired').trim()
  })
  .strict()
