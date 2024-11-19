import { z } from "zod";
import { Gender, AccoutStatus, UserType } from "../enums";

export const UserSchema = z.object({
    email: z.string().email('Invalid email format'),
    nameInFull: z.string().min(1, 'Full name is required').trim(),
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    address: z.string().min(1, 'Address is required').trim(),
    contactNo: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must not exceed 15 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'), // Ensures only digits
    gender: z.nativeEnum(Gender),
    dob: z.string()
        .refine((str) => !isNaN(Date.parse(str)), 'Date of birth must be a valid date format (YYYY-MM-DD)')
        .transform((str) => new Date(str))
        .refine((date) => date < new Date(), 'Date of birth must be in the past'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must not exceed 32 characters')
        .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
        .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
        .regex(/(?=.*\d)/, 'Password must contain at least one number')
        .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),
    accountStatus: z.nativeEnum(AccoutStatus),
    userType: z.nativeEnum(UserType),
    mainModule: z.string().uuid('Invalid Center ID').optional(),
});
