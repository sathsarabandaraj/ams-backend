import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const requestBodyValidator = <T extends ZodSchema>(schema: T) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if the body has a 'data' field and parse accordingly
            const dataToValidate = req.body.data ? JSON.parse(req.body.data) : req.body;

            // Validate the parsed data against the schema
            schema.parse(dataToValidate);
            next(); // If validation passes, proceed to the next middleware/route handler
        } catch (err) {
            console.log(err); // Log the error for debugging
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((issue) => ({
                    message: `${issue.path.join('.')} : ${issue.message}`,
                }));
                return res.status(400).json({ error: 'Invalid data', details: errorMessages });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};
