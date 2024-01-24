import { Request, Response } from 'express';
import db from '../database/db';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

//TODO: Use bcrypt instead of argon2
//TODO: Error handling (try/catch etc.)
//TODO: Status codes

export const all = async (req: Request, res: Response) => {
    const users = await db.User.findAll();
    res.json(users);
};

export const one = async (req: Request, res: Response) => {
    const user = await db.User.findByPk(req.params.id);
    if (user === null) {
        res.json(null);
    } else {
        res.json(user);
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

        const user = await db.User.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                is_restricted: req.body.is_restricted,
                is_admin: req.body.is_admin,
            },
            { fields: ['name', 'email', 'password'] }
        );

        // If email already exists, return conflict error
        if (user === null) {
            res.status(409).json({ message: 'Email already exists' });
            return;
        }

        // Create JWT tokens
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '1h',
        });

        const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: '1d',
        });

        // If there isn't already a token for this user, create one
        let token = await db.Token.findOne({ where: { userId: user.id } });
        console.log('token found on user creation:', token);
        console.log('refresh token going into db:', refreshToken);
        if (token === null) {
            token = await db.Token.create({
                id: refreshToken,
                userId: user.id,
                time: new Date(),
            });
        }

        // Add jwt to cookie
        res.setHeader(
            'Set-Cookie',
            `jwt=${refreshToken}; HttpOnly; Secure; SameSite=None; Path=/;`
        );
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedUser = req.body;
    const { password } = updatedUser;
    console.log(updatedUser);

    const user = await db.User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }

    // only update password if it's not empty
    if (password && password !== user.password) {
        console.log(
            'UPDATING PASSWORD ----------------------------------------------------',
            password
        );
        const hash = await argon2.hash(password, { type: argon2.argon2id });
        updatedUser.password = hash;
    }

    await user.update(updatedUser);
    await user.save();

    res.json(user);
};

export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log('attempting to delete user', id);
    const user = await db.User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }
    await user.destroy();
    res.json({ message: 'user deleted' });
};

export const exists = async (req: Request, res: Response) => {
    const { email } = req.params;
    const amount = await db.User.count({
        where: {
            email: email
        }
    });
    console.log('email address available: ' + amount);
    if (amount === 0) {
        return res.status(200).json({ message: 'Email address is available.' });
    } else {
        return res.status(409).json({ message: 'Email address is already registered.' })
    }
}
