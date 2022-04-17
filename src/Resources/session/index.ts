import post from './post';
import express from 'express';
import deleteRoute from './delete';
import { body } from 'express-validator';
import { validate } from '../../utils';

const session = express.Router();

session.post('/', validate([body('email').isEmail(), body('password').isLength({ min: 8, max: 24 })]), post);

session.delete('/', deleteRoute);

export default session;
