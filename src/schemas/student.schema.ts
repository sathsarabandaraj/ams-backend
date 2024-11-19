import { z } from "zod";
import { PreferredMode } from "../enums";
import { UserSchema } from "./user.schema";
import { ContactInfoSchema } from "./contact-info.schema";

const StudentDataSchema = z.object({
    school: z.string().min(1, 'School name is required').trim(),
    grade: z.string().min(1, 'Grade is required').trim(),
    nearestCenter: z.string().uuid('Invalid Center ID').optional(),
    preferredMode: z.nativeEnum(PreferredMode).optional(),
    guardian: ContactInfoSchema.optional(),
    emergencyContact: ContactInfoSchema.optional(),
});

// Define the Student schema
export const StudentSchema = z.object({
    user: UserSchema,
    student: StudentDataSchema,
});
