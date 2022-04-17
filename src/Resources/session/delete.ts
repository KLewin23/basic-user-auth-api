import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    req.logOut();
    res.status(200).send('User logged out');
};
