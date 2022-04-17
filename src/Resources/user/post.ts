import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import user from '../../Models/user';

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const existingUser = await user.findOne({ where: { email: req.body.email } });
        if (existingUser) return res.status(400).send('Account with email already exists');
        const salt = crypto.randomBytes(16).toString('base64');
        const password = await bcrypt.hash(`${salt}${req.body.password}`, 10);
        await new user({
            email: req.body.email,
            password,
            salt,
        }).save();
        res.status(200).send('User created');
    } catch (e: unknown) {
        return next(e)
    }
};
