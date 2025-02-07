import { z } from 'zod'

const ValidOrderValues = ['ASC', 'DESC'] as const

export const PaginationSchema = z.object({
  pageNumber: z.coerce.number().int().nonnegative(),
  pageSize: z.coerce.number().int().positive().max(1000),
  order: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        return ValidOrderValues.includes(
          val as (typeof ValidOrderValues)[number]
        )
      },
      {
        message: 'paginationOrderInvalid'
      }
    )
})

export type PaginationRequest = z.infer<typeof PaginationSchema>
