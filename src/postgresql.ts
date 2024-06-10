import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
    "user": process.env.USER_DATABASE,
    "password": process.env.PASSWORD_DATABASE,
    "database": process.env.DATABASE,
    "host": process.env.HOST_DATABASE,
    "port": Number(process.env.PORT_DATABASE),
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err: any) => {
    console.error('PostgreSQL connection pool error: ', err);
});

export { pool };