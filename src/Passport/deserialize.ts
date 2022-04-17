import { Done } from '../Types';
import user from '../Models/user';

export default async (req: Express.Request, id: number, done: Done): Promise<void> => {
    try {
        const result = await user.findOne({ where: { id } });
        if (!result) return done({ message: `No user found`, code: 404 }, false);
        return done(undefined, { id: result.id, email: result.email });
    } catch (err) {
        return done(err);
    }
};
