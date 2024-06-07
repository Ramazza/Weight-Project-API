"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                console.log('Error!', error);
                return response.status(500).json({ error: 'Internal Server Error ' });
            }
            (0, bcrypt_1.hash)(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.log('Hashing Error: ', err);
                    connection.release();
                    return response.status(500).json({ error: 'Internal Server Error ' });
                }
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), name, email, hashedPassword], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.log('Querry Error: ', queryError);
                        return response.status(400).json({ error: 'Error creating user' });
                    }
                    return response.status(200).json({ message: 'User created successfuly' });
                });
            });
        });
    }
    login(request, response) {
        const { email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results, fields) => {
                connection.release();
                if (error) {
                    response.status(400).json({ error: 'Erro na Autentificação' });
                }
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    if (error) {
                        response.status(400).json({ error: 'Erro na Autentificação' });
                    }
                    if (result) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email,
                        }, process.env.SECRET, { expiresIn: '1d' });
                        console.log(token);
                        return response.status(200).json({ token: token, message: 'Autentificação com sucesso' });
                    }
                });
            });
        });
    }
    addData(request, response) {
        const { user_id, weight, fat, muscle, vis_fat, body_age, date } = request.body;
        const decode = (0, jsonwebtoken_1.verify)(request.headers.authorization, process.env.SECRET);
        if (decode.email) {
            mysql_1.pool.getConnection((error, connection) => {
                if (error) {
                    console.log('Error!', error);
                    return response.status(500).json({ error: 'Internal Server Error ' });
                }
                connection.query('INSERT INTO weight (user_id, weight, fat, muscle, vis_fat, body_age, date) VALUES (?,?,?,?,?,?,?)', [user_id, weight, fat, muscle, vis_fat, body_age, date], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.log('Querry Error: ', queryError);
                        return response.status(400).json({ error: 'Error creating data entry' });
                    }
                    return response.status(200).json({ message: 'Data entry created with success' });
                });
            });
        }
    }
    setHeight(request, response) {
        const { height, email } = request.body;
        const decode = (0, jsonwebtoken_1.verify)(request.headers.authorization, process.env.SECRET);
        if (decode.email) {
            mysql_1.pool.getConnection((error, connection) => {
                if (error) {
                    console.log('Error!', error);
                    return response.status(500).json({ error: 'Internal Server Error ' });
                }
                connection.query('UPDATE users SET height = ? WHERE email = ?', [height, email], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.log('Querry Error: ', queryError);
                        return response.status(400).json({ error: 'Error creating data entry' });
                    }
                    return response.status(200).json({ message: 'Data entry created with success' });
                });
            });
        }
    }
    setGoal(request, response) {
        const { goal, email } = request.body;
        const decode = (0, jsonwebtoken_1.verify)(request.headers.authorization, process.env.SECRET);
        if (decode.email) {
            mysql_1.pool.getConnection((error, connection) => {
                if (error) {
                    console.log('Error!', error);
                    return response.status(500).json({ error: 'Internal Server Error ' });
                }
                connection.query('UPDATE users SET goal = ? WHERE email = ?', [goal, email], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.log('Querry Error: ', queryError);
                        return response.status(400).json({ error: 'Error creating data entry' });
                    }
                    return response.status(200).json({ message: 'Data entry created with success' });
                });
            });
        }
    }
    addProfileImage() {
    }
    getUserInfo() {
    }
    getLatestWeight() {
    }
}
exports.UserRepository = UserRepository;
