import { Request, Response } from 'express';
import db from '../database/db';
import jwt from 'jsonwebtoken';

//TODO: Error handling (try/catch etc.)

export const refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    // console.log('cookies.jwt', cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundToken = await db.Token.findOne({ where: { id: refreshToken } });
    const foundUser = await foundToken?.getUser();
    if (!foundUser) return res.status(403).json({ message: 'User not found' });

    // eval jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, decoded: any) => {
        if (err || foundUser.email !== decoded?.email) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        // create new jwt
        const accessToken = jwt.sign({ email: foundUser.email }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '1h',
        });

        res.status(200).json({ user: foundUser, accessToken });
    });
};
