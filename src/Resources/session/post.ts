import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    if (req.user) return res.status(409).send('User is already logged in');
    return passport.authenticate('local', async (err, user): Promise<Response | void> => {
        if (err) {
            // if (err.code === 500 || err.code === undefined) return handleError(req, err, res, next);
            return res.status(err.code || 0).send(err.message);
        }
        return req.login(user, async loginError => {
            if (loginError) return next(err);
            return res.status(200).send('Login Successful');
        });
    })(req, res, next);
};
