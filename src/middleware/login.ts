import { verify, JwtPayload  } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

/* const login = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        const decode = verify(token, process.env.SECRET as string);
        req.user = decode; // Assign the decoded token to the user property
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Não autorizado' });
    }
}; */

const login = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error('Authorization header missing');
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error('Token missing from Authorization header');
            return res.status(401).json({ message: 'Token missing from Authorization header' });
        }

        let decode;
        try {
            decode = verify(token, process.env.SECRET as string);
        } catch (tokenError) {
            console.error('Invalid token', tokenError);
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (!decode || typeof decode !== 'object' || !decode.email) {
            console.error('Invalid token payload');
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        req.user = decode; // Assign the decoded token to the user property
        next();
    } catch (error: any) {
        console.error('Authorization error', error);
        return res.status(401).json({ message: 'Não autorizado', error: error.message });
    }
};

export { login };

