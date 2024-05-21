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
                        if(error) {
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

                            return response.status(200).json({ token: token, message: 'Autentificação com sucesso' });
                        }
                    });
                }
            );
        });
    }

    // login(request: Request, response: Response) {
    //     const { email, password } = request.body;
    //     pool.getConnection((error: any, connection: any) => {
    //         if (error) {
    //             console.log('Error!', error);
    //             return response.status(500).json({ error: 'Internal Server Error' });
    //         }
    
    //         connection.query('SELECT * FROM users WHERE email = ?', [email], (queryError: any, results: any, fields: any) => {
    //             connection.release();
    //             if (queryError) {
    //                 console.log('Query Error:', queryError);
    //                 return response.status(500).json({ error: 'Internal Server Error' });
    //             }
    
    //             if (results.length === 0) {
    //                 return response.status(401).json({ error: 'Invalid email or password' });
    //             }
    
    //             compare(password, results[0].password, (err, result) => {
    //                 if (err) {
    //                     console.log('Comparison Error:', err);
    //                     return response.status(500).json({ error: 'Internal Server Error' });
    //                 }
    
    //                 if (!result) {
    //                     return response.status(401).json({ error: 'Invalid email or password' });
    //                 }
    
    //                 const token = sign(
    //                     {
    //                         id: results[0].user_id,
    //                         email: results[0].email,
    //                     },
    //                     process.env.SECRET as string,
    //                     { expiresIn: '1d' }
    //                 );
    
    //                 return response.status(200).json({ token: token, message: 'Authentication successful' });
    //             });
    //         });
    //     });
    // }

}

export { UserRepository };