import './Types';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Response } from 'express';
import { ApiError, Done } from './Types';
import passport from 'passport';
import sequelize from './Models';
import Resources from './Resources';
import bodyParser from 'body-parser';
import { createClient } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import LocalStrategy from './Passport/local';
import deserialize from './Passport/deserialize';
import { logger } from './utils';

const environment = process.env.NODE_ENV || 'development';
dotenv.config();

const app = express();
const clientUrl = environment === 'development' ? 'http://localhost:3000' : 'https://api.credovo.com';

// NOTE look at this towards release https://github.com/pillarjs/understanding-csrf

const redisStore = connectRedis(session);
const redisClient = createClient({ legacyMode: true });
redisClient.on('error', err => {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', () => {
    console.log('Connected to redis successfully');
});

(async () => {
    await redisClient.connect();
    await sequelize.sync();
    app.use(
        cors({
            origin: clientUrl,
            credentials: true,
            optionsSuccessStatus: 200,
        }),
    );
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(
        //TODO when going to production, go to docs and check its safe
        session({
            name: 'secret',
            secret: process.env.API_SECRET || 'secret',
            resave: true,
            saveUninitialized: true,
            store: new redisStore({ client: redisClient }),
            cookie: {
                secure: environment !== 'development',
                maxAge: 1000 * 60 * 10,
            },
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user: Express.User, done) => done(null, user.id));
    passport.deserializeUser((req: express.Request, id: number, done: Done) => deserialize(req, id, done));
    passport.use(LocalStrategy);
    app.use('/', Resources);
    app.use((err: ApiError, req: Express.Request, res: Response, next: NextFunction) => {
        logger.error(`ERROR: ${err.message} CODE: ${err.code}`);
        next();
    });
    app.listen(4000, () => logger.info('Server start on port 4000'));
})();
