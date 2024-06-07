"use strict";
/* import { verify } from "jsonwebtoken";

const login = (req: any, res: any, next: any) => {
    try {
        const decode = verify(req.headers.authorization, process.env.SECRET as string);
        req.user = decode;
        next();
    } catch(error) {
        return res.status(401).json({ message: 'Não autorizado '});
    }
}

export { login }; */
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const login = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
        req.user = decode; // Assign the decoded token to the user property
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Não autorizado' });
    }
};
exports.login = login;
