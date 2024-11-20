import { z } from "zod";

export const ContactInfoSchema = z.object({
    name: z.string().min(1, 'zod.schema.fullnameRequired').trim(),
    relationship: z.string().min(1, 'zod.schema.addressRequired').trim(),
    contactNo: z.string().min(10, 'zod.schema.phoneNumberMinLength')
        .max(15, 'zod.schema.phoneNumberMaxLength')
        .regex(/^\d+$/, 'zod.schema.phoneNumberDigitsOnly'),
    email: z.string().email('zod.schema.invalidEmailFormat').optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;