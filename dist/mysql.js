"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const pool = mysql2_1.default.createPool({
    "user": process.env.USER_DATABASE,
    "password": process.env.PASSWORD_DATABASE,
    "database": process.env.DATABASE,
    "host": process.env.HOST_DATABASE,
    "port": Number(process.env.PORT_DATABASE),
    connectionLimit: 20,
});
exports.pool = pool;
pool.on('error', (err) => {
    console.error('MySQL connection pool error: ', err);
});
