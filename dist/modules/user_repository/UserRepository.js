"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const postgresql_1 = require("../../postgresql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        postgresql_1.pool.connect((error, connection) => {
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
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES ($1,$2,$3,$4)', [(0, uuid_1.v4)(), name, email, hashedPassword], (queryError, result, fields) => {
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
        if (!email || !password) {
            return response.status(400).json({ error: 'Email and password are required' });
        }
        postgresql_1.pool.connect((error, connection) => {
            if (error) {
                console.error('Error getting database connection:', error);
                return response.status(500).json({ error: 'Internal server error. Please try again later.' });
            }
            connection.query('SELECT * FROM users WHERE email = $1', [email], (queryError, results) => {
                connection.release();
                if (queryError) {
                    console.error('Error executing query:', queryError);
                    return response.status(500).json({ error: 'Internal server error. Please try again later.' });
                }
                if (!results || results.rows.length === 0) {
                    console.warn('Invalid login attempt: email not found', { email });
                    return response.status(401).json({ error: 'Invalid email or password' });
                }
                const user = results.rows[0];
                (0, bcrypt_1.compare)(password, user.password, (compareError, isMatch) => {
                    if (compareError) {
                        console.error('Error comparing passwords:', compareError);
                        return response.status(500).json({ error: 'Internal server error. Please try again later.' });
                    }
                    if (isMatch) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: user.user_id,
                            email: user.email,
                        }, process.env.SECRET, { expiresIn: '1d' });
                        console.log('Generated Token:', token);
                        return response.status(200).json({ token: token, message: 'Authentication successful' });
                    }
                    else {
                        console.warn('Invalid login attempt: incorrect password', { email });
                        return response.status(401).json({ error: 'Invalid email or password' });
                    }
                });
            });
        });
    }
    addData(request, response) {
        try {
            const { user_id, weight, fat, muscle, vis_fat, body_age, date } = request.body;
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return response.status(401).json({ error: 'No token provided' });
            }
            let decode;
            try {
                decode = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
            }
            catch (tokenError) {
                return response.status(401).json({ error: 'Invalid token' });
            }
            if (!decode || typeof decode !== 'object' || !decode.email) {
                return response.status(401).json({ error: 'Unauthorized access' });
            }
            postgresql_1.pool.connect((error, connection) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query('INSERT INTO weight (user_id, weight, fat, muscle, vis_fat, body_age, date) VALUES ($1,$2,$3,$4,$5,$6,$7)', [user_id, weight, fat, muscle, vis_fat, body_age, date], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.error('Query Error:', queryError);
                        return response.status(400).json({ error: 'Error updating data entry' });
                    }
                    if (result.affectedRows === 0) {
                        return response.status(404).json({ message: 'No user found with the provided email' });
                    }
                    return response.status(200).json({ message: 'Data entry updated successfully' });
                });
            });
        }
        catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    setHeight(request, response) {
        try {
            const { height, user_id } = request.body;
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return response.status(401).json({ error: 'No token provided' });
            }
            let decode;
            try {
                decode = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
            }
            catch (tokenError) {
                return response.status(401).json({ error: 'Invalid token' });
            }
            if (!decode || typeof decode !== 'object' || !decode.email) {
                return response.status(401).json({ error: 'Unauthorized access' });
            }
            postgresql_1.pool.connect((error, connection) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query('UPDATE users SET height = $1 WHERE user_id = $2', [height, user_id], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.error('Query Error:', queryError);
                        return response.status(400).json({ error: 'Error updating data entry' });
                    }
                    if (result.affectedRows === 0) {
                        return response.status(404).json({ message: 'No user found with the provided email' });
                    }
                    return response.status(200).json({ message: 'Data entry updated successfully' });
                });
            });
        }
        catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    setGoal(request, response) {
        try {
            const { goal, user_id } = request.body;
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return response.status(401).json({ error: 'No token provided' });
            }
            let decode;
            try {
                decode = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
            }
            catch (tokenError) {
                return response.status(401).json({ error: 'Invalid token' });
            }
            if (!decode || typeof decode !== 'object' || !decode.email) {
                return response.status(401).json({ error: 'Unauthorized access' });
            }
            postgresql_1.pool.connect((error, connection) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query('UPDATE users SET goal =$1  WHERE user_id = $2', [goal, user_id], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.error('Query Error:', queryError);
                        return response.status(400).json({ error: 'Error updating data entry' });
                    }
                    if (result.affectedRows === 0) {
                        return response.status(404).json({ message: 'No user found with the provided email' });
                    }
                    return response.status(200).json({ message: 'Data entry updated successfully' });
                });
            });
        }
        catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    getUserInfo(request, response) {
        const { user_id } = request.query;
        postgresql_1.pool.connect((error, connection) => {
            if (error) {
                return response.status(500).json({ error: 'Erro ao conectar ao banco de dados!' });
            }
            connection.query('SELECT * FROM users WHERE user_id = $1', [user_id], (error, results) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro ao buscar os dados do usuário!' });
                }
                if (results.length === 0) {
                    return response.status(404).json({ message: 'Usuário não encontrado!' });
                }
                return response.status(200).json({ message: 'Dados do usuário retornados com sucesso', user: results[0] });
            });
        });
    }
    getLatestWeight(request, response) {
        const { user_id } = request.query;
        postgresql_1.pool.connect((error, connection) => {
            if (error) {
                return response.status(500).json({ error: 'Erro ao conectar ao banco de dados!' });
            }
            connection.query('SELECT weight FROM weight WHERE date = (SELECT MAX(date) FROM weight WHERE user_id = $1) AND user_id = $2', [user_id, user_id], (error, results) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro ao buscar os dados do usuário!' });
                }
                if (results.length === 0) {
                    return response.status(404).json({ message: 'Usuário não encontrado!' });
                }
                return response.status(200).json({ message: 'Dados do usuário retornados com sucesso', user: results[0] });
            });
        });
    }
    getAllUserData(request, response) {
        try {
            const { user_id } = request.query;
            postgresql_1.pool.connect((error, connection) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query('SELECT * FROM weight WHERE user_id = $1', [user_id], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.error('Query Error:', queryError);
                        return response.status(400).json({ error: 'Error updating data entry' });
                    }
                    if (result.affectedRows === 0) {
                        return response.status(404).json({ message: 'No data found for the provided user ID' });
                    }
                    return response.status(200).json(result);
                });
            });
        }
        catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    deleteUserData(request, response) {
        try {
            const { id } = request.query;
            postgresql_1.pool.connect((error, connection) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query('DELETE FROM weight WHERE id = $1', [id], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.error('Query Error:', queryError);
                        return response.status(400).json({ error: 'Error deleting data entry' });
                    }
                    if (result.affectedRows === 0) {
                        return response.status(404).json({ message: 'No data found for the provided ID' });
                    }
                    return response.status(200).json({ message: 'Data entry deleted successfully' });
                });
            });
        }
        catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    updateUserData(request, response) {
        try {
            const { id, weight, fat, muscle, vis_fat, body_age, date } = request.body;
            postgresql_1.pool.connect((error, connection) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query(`UPDATE weight 
                    SET weight = $1, fat = $2, muscle = $3, vis_fat = $4, body_age = $5, date = $6 
                    WHERE id = $7`, [weight, fat, muscle, vis_fat, body_age, date, id], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.error('Query Error:', queryError);
                        return response.status(400).json({ error: 'Error updating data entry' });
                    }
                    if (result.affectedRows === 0) {
                        return response.status(404).json({ message: 'No data found for the provided ID' });
                    }
                    return response.status(200).json({ message: 'Data entry updated successfully' });
                });
            });
        }
        catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
}
exports.UserRepository = UserRepository;
