import { pool } from "../../mysql";
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';

class UserRepository {

    create(request: Request, response: Response) {
        const { name, email, password } = request.body;
        pool.getConnection((error: any, connection: any) => {
            if(error) {
                console.log('Error!', error);
                return response.status(500).json({ error: 'Internal Server Error '});
            }

            hash(password, 10, (err, hashedPassword) => {
                if(err) {
                    console.log('Hashing Error: ', err);
                    connection.release();
                    return response.status(500).json({ error: 'Internal Server Error '});
                }

            connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
                    [uuidv4(), name, email, hashedPassword],
                    (queryError: any, result: any, fields: any) => {
                        connection.release();
                        if(queryError) {
                            console.log('Querry Error: ', queryError);
                            return response.status(400).json({ error: 'Error creating user' });
                        }
                        return response.status(200).json({ message: 'User created successfuly' });
                    }
                )
            })
        })
    }

    login(request: Request, response: Response) {
        const { email, password } = request.body;
        pool.getConnection((error: any, connection: any) => {
            connection.query('SELECT * FROM users WHERE email = ?',
                [email],
                (error: any, results: any, fields: any) => {
                    connection.release();
                    if(error) {
                        response.status(400).json({ error: 'Erro na Autentificação' });
                    }
                    compare(password, results[0].password, (err, result) => {
                        if(err) {
                            response.status(400).json({ error: 'Erro na Autentificação' });
                        }
                        if(result) {
                            const token = sign(
                                {
                                    id: results[0].user_id,
                                    email: results[0].email,
                                },
                                process.env.SECRET as string,
                                {expiresIn: '1d'}
                            );
                            console.log('Generated Token:', token);
                            return response.status(200).json({ token: token, message: 'Autentificação com sucesso' });
                        }
                        else {
                            return response.status(401).json({ error: 'Invalid email or password' });
                        }
                    });
                }
            );
        });
    }

    addData(request: any, response: any) {
        try {
            const { user_id, weight, fat, muscle, vis_fat, body_age, date} = request.body;
            const token = request.headers.authorization?.split(' ')[1];

            if (!token) {
                return response.status(401).json({ error: 'No token provided' });
            }

            let decode;
            try {
                decode = verify(token, process.env.SECRET as string);
            } catch (tokenError) {
                return response.status(401).json({ error: 'Invalid token' });
            }

            if (!decode || typeof decode !== 'object' || !decode.email) {
                return response.status(401).json({ error: 'Unauthorized access' });
            }

            pool.getConnection((error: any, connection: any) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }

                connection.query('INSERT INTO weight (user_id, weight, fat, muscle, vis_fat, body_age, date) VALUES (?,?,?,?,?,?,?)', 
                [user_id, weight, fat, muscle, vis_fat, body_age, date], 
                    (queryError: any, result: any, fields: any) => {
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

        } catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        // const decode: any = verify(request.headers.authorization, process.env.SECRET as string);
      /*   if (decode.email){
            pool.getConnection((error: any, connection: any) => {
                if(error) {
                    console.log('Error!', error);
                    return response.status(500).json({ error: 'Internal Server Error '});
                }
    
                connection.query('INSERT INTO weight (user_id, weight, fat, muscle, vis_fat, body_age, date) VALUES (?,?,?,?,?,?,?)', 
                        [user_id, weight, fat, muscle, vis_fat, body_age, date],
                        (queryError: any, result: any, fields: any) => {
                            connection.release();
                            if(queryError) {
                                console.log('Querry Error: ', queryError);
                                return response.status(400).json({ error: 'Error creating data entry' });
                            }
                            return response.status(200).json({ message: 'Data entry created with success' });
                        }
                )
            })
        } */
    } 

    setHeight(request: Request, response: Response) {
        try {
            const { height, user_id } = request.body;
            const token = request.headers.authorization?.split(' ')[1];

            if (!token) {
                return response.status(401).json({ error: 'No token provided' });
            }

            let decode;
            try {
                decode = verify(token, process.env.SECRET as string);
            } catch (tokenError) {
                return response.status(401).json({ error: 'Invalid token' });
            }

            if (!decode || typeof decode !== 'object' || !decode.email) {
                return response.status(401).json({ error: 'Unauthorized access' });
            }

            pool.getConnection((error: any, connection: any) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }

                connection.query('UPDATE users SET height = ? WHERE user_id = ?', [height, user_id], (queryError: any, result: any, fields: any) => {
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
        } catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    setGoal(request: Request, response: Response) {
        try {
            const { goal, user_id } = request.body;
            const token = request.headers.authorization?.split(' ')[1];

            if (!token) {
                return response.status(401).json({ error: 'No token provided' });
            }

            let decode;
            try {
                decode = verify(token, process.env.SECRET as string);
            } catch (tokenError) {
                return response.status(401).json({ error: 'Invalid token' });
            }

            if (!decode || typeof decode !== 'object' || !decode.email) {
                return response.status(401).json({ error: 'Unauthorized access' });
            }

            pool.getConnection((error: any, connection: any) => {
                if (error) {
                    console.error('Error getting database connection:', error);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }

                connection.query('UPDATE users SET goal = ? WHERE user_id = ?', [goal, user_id], (queryError: any, result: any, fields: any) => {
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
        } catch (err) {
            console.error('Unexpected Error:', err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    addProfileImage() {
        
    }

    getUserInfo(request: any, response: any) {
        const { user_id } = request.query;
        pool.getConnection((error: any, connection: any) => {
            if (error) {
                return response.status(500).json({ error: 'Erro ao conectar ao banco de dados!' });
            }
    
            connection.query(
                'SELECT * FROM users WHERE user_id = ?',
                [user_id],
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro ao buscar os dados do usuário!' });
                    }
    
                    if (results.length === 0) {
                        return response.status(404).json({ message: 'Usuário não encontrado!' });
                    }
    
                    return response.status(200).json({ message: 'Dados do usuário retornados com sucesso', user: results[0] });
                }
            );
        });
    }
    

    getLatestWeight(request: any, response: any) {
        const { user_id } = request.query;
        pool.getConnection((error: any, connection: any) => {
            if(error) {
                return response.status(500).json({ error: 'Erro ao conectar ao banco de dados!' });
            }

            connection.query(
                'SELECT weight FROM weight WHERE date = (SELECT MAX(date) FROM weight WHERE user_id = ?) AND user_id = ?',
                [user_id, user_id],
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro ao buscar os dados do usuário!' });
                    }
    
                    if (results.length === 0) {
                        return response.status(404).json({ message: 'Usuário não encontrado!' });
                    }
    
                    return response.status(200).json({ message: 'Dados do usuário retornados com sucesso', user: results[0] });
                }
            );
        })
    }
}

export { UserRepository };