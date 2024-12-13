import { z } from 'zod'

// Define the regex for systemId validation
const systemIdPattern = /^(unk-(stu|sta)-[A-Za-z0-9]{4})$/

export const SystemIDSchema = z
  .string()
  .min(1, 'zod.schema.systemIdRequired')
  .trim()
  .regex(systemIdPattern, 'zod.schema.invalidSystemId')

export type SystemIDData = z.infer<typeof SystemIDSchema>
