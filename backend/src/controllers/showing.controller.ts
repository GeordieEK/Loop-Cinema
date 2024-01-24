import { Request, Response } from 'express';
import db from '../database/db';

export const all = async (req: Request, res: Response) => {
    const showings = await db.Token.findAll();
    res.json(showings);
};

export const one = async (req: Request, res: Response) => {
    const showing = await db.Token.findByPk(req.params.id);
    if (showing === null) {
        res.json(null);
    } else {
        res.json(showing);
    }
};

export const create = async (req: Request, res: Response) => {
    const showing = await db.Token.create({
        id: req.body.id,
        time: req.body.time,
    });

    res.json(showing);
};
