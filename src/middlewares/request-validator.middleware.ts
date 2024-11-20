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
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((issue) => ({
                    message: `${issue.path.join('.')} : ${req.t(issue.message)}`,
                }));
                return res.status(400).json({ error: req.t('zod.middleware.invalidData'), details: errorMessages });
            }
            return res.status(500).json({ error: req.t('server.internalServerErr') });
        }
    };
};

export const requestQueryValidator = <T extends ZodSchema>(schema: T) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${req.t('issue.message')}`
                }))
                return res
                    .status(400)
                    .json({ error: req.t('zod.middleware.invalidData'), details: errorMessages })
            }
            return res.status(500).json({ error: req.t('server.internalServerErr') })
        }
    }
}
