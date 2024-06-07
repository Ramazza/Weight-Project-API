import mysql from 'mysql2';
import { config } from 'dotenv';

config();

const pool = mysql.createPool({
    "user": process.env.USER_DATABASE,
    "password": process.env.PASSWORD_DATABASE,
    "database": process.env.DATABASE,
    "host": process.env.HOST_DATABASE,
    "port": Number(process.env.PORT_DATABASE),
    connectionLimit: 20,
});

pool.on('error', (err) => {
    console.error('MySQL connection pool error: ', err);
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error getting MySQL connection: ', err);
    } else {
        console.log('Connected to MySQL database');
        connection.release();
    }
});

export { pool };