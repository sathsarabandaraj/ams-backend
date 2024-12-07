import { z } from "zod";
import { PreferredMode } from "../enums";
import { UserSchema } from "./user.schema";
import { ContactInfoSchema } from "./contact-info.schema";

const StudentDataSchema = z.object({
    school: z.string().min(1, 'zod.schema.schoolRequired').trim(),
    grade: z.string().min(1, 'zod.schema.gradeRequired').trim(),
    preferredMode: z.nativeEnum(PreferredMode).optional(),
    guardian: ContactInfoSchema.strict().optional(),
    emergencyContact: ContactInfoSchema.strict().optional(),
});

// Define the Student schema
export const StudentSchema = z.object({
    user: UserSchema.extend({
        student: StudentDataSchema.strict()
    }).strict(),
});

export const UpdateStudentSchema = z.object({
    user: UserSchema.partial().extend({
        student: StudentDataSchema.deepPartial().strict()
    }).strict(),
})