"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const postgresql_1 = require("../../postgresql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    async create(request, response) {
        const { name, email, password } = request.body;
        try {
            const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
            await postgresql_1.pool.query('INSERT INTO users (user_id, name, email, password) VALUES ($1, $2, $3, $4)', [(0, uuid_1.v4)(), name, email, hashedPassword]);
            response.status(200).json({ message: 'User created successfully' });
        }
        catch (error) {
            console.error('Error creating user:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async login(request, response) {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({ error: 'Email and password are required' });
        }
        try {
            const results = await postgresql_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (results.rows.length === 0) {
                return response.status(401).json({ error: 'Invalid email or password' });
            }
            const user = results.rows[0];
            const isMatch = await (0, bcrypt_1.compare)(password, user.password);
            if (isMatch) {
                const token = (0, jsonwebtoken_1.sign)({
                    id: user.user_id,
                    email: user.email,
                }, process.env.SECRET, { expiresIn: '1d' });
                response.status(200).json({ token: token, message: 'Authentication successful' });
            }
            else {
                response.status(401).json({ error: 'Invalid email or password' });
            }
        }
        catch (error) {
            console.error('Error during login:', error);
            response.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    }
    async addData(request, response) {
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
        try {
            await postgresql_1.pool.query('INSERT INTO weight (user_id, weight, fat, muscle, vis_fat, body_age, date) VALUES ($1, $2, $3, $4, $5, $6, $7)', [user_id, weight, fat, muscle, vis_fat, body_age, date]);
            response.status(200).json({ message: 'Data entry updated successfully' });
        }
        catch (error) {
            console.error('Error updating data entry:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async setHeight(request, response) {
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
        try {
            const result = await postgresql_1.pool.query('UPDATE users SET height = $1 WHERE user_id = $2', [height, user_id]);
            if (result.rowCount === 0) {
                return response.status(404).json({ message: 'No user found with the provided email' });
            }
            return response.status(200).json({ message: 'Data entry updated successfully' });
        }
        catch (error) {
            console.error('Error updating data entry:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async setGoal(request, response) {
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
        try {
            const result = await postgresql_1.pool.query('UPDATE users SET goal = $1 WHERE user_id = $2', [goal, user_id]);
            if (result.rowCount === 0) {
                return response.status(404).json({ message: 'No user found with the provided email' });
            }
            return response.status(200).json({ message: 'Data entry updated successfully' });
        }
        catch (error) {
            console.error('Error updating data entry:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getUserInfo(request, response) {
        const { user_id } = request.query;
        try {
            const result = await postgresql_1.pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
            if (result.rows.length === 0) {
                return response.status(404).json({ message: 'Usuário não encontrado!' });
            }
            else if (result.rows.length === 1) {
                return response.status(200).json({ message: 'Dados do usuário retornados com sucesso', user: result.rows[0] });
            }
            else {
                return response.status(400).json({ error: 'Mais de um usuário encontrado!' });
            }
        }
        catch (error) {
            console.error('Erro ao buscar os dados do usuário:', error);
            return response.status(500).json({ error: 'Erro ao conectar ao banco de dados!' });
        }
    }
    async getLatestWeight(request, response) {
        const { user_id } = request.query;
        try {
            const result = await postgresql_1.pool.query('SELECT weight FROM weight WHERE date = (SELECT MAX(date) FROM weight WHERE user_id = $1) AND user_id = $2', [user_id, user_id]);
            if (result.rows.length === 0) {
                return response.status(404).json({ message: 'Usuário não encontrado!' });
            }
            return response.status(200).json({ user: { weight: result.rows[0].weight } });
        }
        catch (error) {
            console.error('Erro ao buscar os dados do usuário:', error);
            return response.status(500).json({ error: 'Erro ao conectar ao banco de dados!' });
        }
    }
    async getAllUserData(request, response) {
        const { user_id } = request.query;
        try {
            const result = await postgresql_1.pool.query('SELECT * FROM weight WHERE user_id = $1', [user_id]);
            if (result.rowCount === 0) {
                return response.status(404).json({ message: 'No data found for the provided user ID' });
            }
            return response.status(200).json(result.rows);
        }
        catch (error) {
            console.error('Error getting all user data:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteUserData(request, response) {
        const { id } = request.query;
        try {
            const result = await postgresql_1.pool.query('DELETE FROM weight WHERE id = $1', [id]);
            if (result.rowCount === 0) {
                return response.status(404).json({ message: 'No data found for the provided ID' });
            }
            return response.status(200).json({ message: 'Data entry deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting data entry:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateUserData(request, response) {
        const { id, weight, fat, muscle, vis_fat, body_age, date } = request.body;
        try {
            const result = await postgresql_1.pool.query(`UPDATE weight 
                 SET weight = $1, fat = $2, muscle = $3, vis_fat = $4, body_age = $5, date = $6 
                 WHERE id = $7`, [weight, fat, muscle, vis_fat, body_age, date, id]);
            if (result.rowCount === 0) {
                return response.status(404).json({ message: 'No data found for the provided ID' });
            }
            return response.status(200).json({ message: 'Data entry updated successfully' });
        }
        catch (error) {
            console.error('Error updating data entry:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
exports.UserRepository = UserRepository;
