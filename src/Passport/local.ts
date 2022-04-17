import bcrypt from 'bcrypt';
import { Done } from '../Types';
import { Strategy } from 'passport-local';
import user from '../Models/user';

export default new Strategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done: Done) => {
    //TODO add validator
    try {
        const localUser = await user.findOne({ where: { email } });
        if (!localUser) return done({ message: `No user found`, code: 404 }, false);
        const passwordMatches = await bcrypt.compare(`${localUser.salt}${req.body.password}`, localUser.password.toString());
        if (!passwordMatches) {
            return done({ message: 'Unauthorized', code: 403 });
        }
        return done(undefined, {
            id: localUser.id,
            email: localUser.email,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return done({ message: err?.message || '', code: 500 }, false);
        }
        return done({ message: 'Something unexpected went wrong', code: 500 }, false);
    }
});
