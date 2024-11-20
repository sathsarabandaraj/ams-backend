import { z } from "zod";
import { PreferredMode } from "../enums";
import { UserSchema } from "./user.schema";
import { ContactInfoSchema } from "./contact-info.schema";

const StudentDataSchema = z.object({
    school: z.string().min(1, 'zod.schema.schoolRequired').trim(),
    grade: z.string().min(1, 'zod.schema.gradeRequired').trim(),
    nearestCenter: z.string().uuid('zod.schema.invalidCenterId').optional(),
    preferredMode: z.nativeEnum(PreferredMode).optional(),
    guardian: ContactInfoSchema.optional(),
    emergencyContact: ContactInfoSchema.optional(),
});

// Define the Student schema
export const StudentSchema = z.object({
    user: UserSchema,
    student: StudentDataSchema,
});
