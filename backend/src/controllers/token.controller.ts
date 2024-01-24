import { Request, Response } from 'express';
import db from '../database/db';

export const all = async (req: Request, res: Response) => {
    const tokens = await db.Token.findAll();
    res.json(tokens);
};

export const one = async (req: Request, res: Response) => {
    const token = await db.Token.findByPk(req.params.id);
    if (token === null) {
        res.json(null);
    } else {
        res.json(token);
    }
};

export const create = async (req: Request, res: Response) => {
    const token = await db.Token.create({
        id: req.body.id,
        time: new Date(),
        userId: req.body.UserId,
    });

    res.json(token);
};
