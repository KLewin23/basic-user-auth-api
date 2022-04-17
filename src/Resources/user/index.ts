import express from 'express';
import post from './post';
import { validate } from '../../utils';
import { body } from 'express-validator';
// import deleteRoute from './delete';

const user = express.Router();

user.post('/', validate([body('email').isEmail(), body('password').isLength({ min: 8, max: 24 })]), post);

// user.delete('/', deleteRoute);

export default user;
