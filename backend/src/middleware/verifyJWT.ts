import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { Request, Response } from 'express';

const verifyJWT = (req: Request, res: Response, next: Function) => {
    // console.log('Attempting to verify JWT');
    const authHeader = req.headers.authorization;
    // console.log(req.headers);
    let token;

    if (authHeader) {
        // console.log('authHeader', authHeader);
        token = authHeader.split(' ')[1];
    } else if (req.cookies.jwt) {
        // Check for JWT in cookie
        token = req.cookies.jwt;
    } else {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, decoded: any) => {
        if (err) {
            // console.log('err', err);
            res.sendStatus(403);
            return;
        }
        // console.log('decoded', decoded);
        next();
    });
};

export default verifyJWT;
