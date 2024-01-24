import { Request, Response } from 'express';
import db from '../database/db';

// CURRENTLY NOT IN USE - old authentication method
const authenticator = async (req: Request, res: Response, next: Function) => {
    console.log('cookies in authenticator', req.cookies);
    const jwt = req.cookies.jwt;
    if (jwt) {
        const session = await db.Token.findByPk(jwt);
        if (session) {
            const user = await session.getUser();
            if (user) {
                req.body.user = user;
            }
        }
    }
    next();
};
export default authenticator;
