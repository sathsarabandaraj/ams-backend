import { z } from "zod";

export const ContactInfoSchema = z.object({
    name: z.string().min(1, 'Name is required').trim(),
    relationship: z.string().min(1, 'Relationship is required').trim(),
    contactNo: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must not exceed 15 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'), // Ensures only digits
    email: z.string().email('Invalid email format').optional(), // Email is optional
});
