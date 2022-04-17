import express from 'express';
import session from './session';
import user from './user';

const router = express.Router();

router.use('/session', session);
router.use('/user', user);

export default router;
