import { Request, Response } from 'express';
import db from '../database/db';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

//TODO: Use bcrypt instead of argon2i
//TODO: Error handling (try/catch etc.)
//TODO: Status codes

export const me = async (req: Request, res: Response) => {
    const jwt = req.headers.authorization?.split(' ')[1];
    if (!jwt) {
        res.status(401).json(null); // Return a 401 status code if the token ID is invalid
        return;
    }
    const token = await db.Token.findByPk(jwt);
    if (token !== null) {
        const user = await token.getUser(); // Get the user associated with the token
        res.json(user);
    } else {
        res.status(401).json(null); // Return a 401 status code if the token ID is invalid
    }
};

export const login = async (req: Request, res: Response) => {
    // console.log('attempting login');
    const { email, password } = req.body;
    const foundUser = await db.User.findOne({ where: { email: email } });
    if (foundUser === null || (await argon2.verify(foundUser.password, password)) === false) {
        // login failed
        res.status(401).json(null);
    } else {
        // Create JWT tokens
        const accessToken = jwt.sign({ email: foundUser.email }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '1h',
        });

        const refreshToken = jwt.sign(
            { email: foundUser.email },
            process.env.REFRESH_TOKEN_SECRET!,
            {
                expiresIn: '1d',
            }
        );

        // if there isn't already a token for this user, create one
        let token = await db.Token.findOne({ where: { userId: foundUser.id, id: refreshToken } });
        // console.log('refresh token going into db:', refreshToken);
        if (token === null) {
            token = await db.Token.create({
                id: refreshToken,
                userId: foundUser.id,
                time: new Date(),
            });
        }

        // Set cookie with refresh token, it's longer lasting than the access token
        // HTTP settings are for security, limits access (no JS access)
        // Secure: true is for HTTPS only (not for development)
        // sameSite: none allows cross-site access

        // console.log('refreshToken going into cookie:', refreshToken);
        // console.log('cookies before refreshToken inside:', req.cookies);
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 86400000,
        });
        // console.log('cookies after refreshToken inside:', req.cookies);

        // Return token id to the frontend
        res.status(200).json({ accessToken, user: foundUser });
    }
};

export const logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    // console.log('cookies', cookies);
    if (!cookies?.jwt) return res.status(204); // Success but no content
    const refreshToken = cookies.jwt;
    // console.log('refreshToken', refreshToken);
    // Check if refresh token is in db
    try {
        const foundToken = await db.Token.findByPk(refreshToken);
        if (foundToken !== null) {
            // Remove token from db
            await foundToken.destroy();
        }
        // Regardless of whether the token was found or not, remove the cookie
        // TODO: In production, set sameSite: 'strict'
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', maxAge: 0 });
        res.status(204).json({ message: 'Logged out' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
