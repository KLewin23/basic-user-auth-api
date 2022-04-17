const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        username: 'postgres',
        password: process.env.DATABASE_PASS,
        database: 'demo',
        host: '127.0.0.1',
        dialect: 'postgres',
    },
};
