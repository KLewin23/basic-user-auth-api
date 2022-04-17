import User from './user';
import { Sequelize } from 'sequelize-typescript';

export default new Sequelize(process.env.DATABASE_URL || '', { dialect: 'postgres', models: [User] });
