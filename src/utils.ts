import express from 'express';
import winston from 'winston';
import { ValidationChain, validationResult } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        for (const validation of validations) {
            const result = await validation.run(req);
            // @ts-ignore
            if (result.errors.length) break;
        }
        const errors = validationResult(req);
        console.log(errors);
        if (errors.isEmpty()) {
            return next();
        }

        //TODO logging needs adding
        return res.status(400).json({ errors: errors.array() });
    };
};

export const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});
