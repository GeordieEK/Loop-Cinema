import { Request, Response } from 'express';
import db from '../database/db';
import { Showing } from '../database/models/showing';

export const all = async (req: Request, res: Response) => {
    const movies = await db.Movie.findAll({
        include: [
            {
              model: db.Showing,
              as: 'showings',
            },
        ],
    });
    res.json(movies);
};

export const one = async (req: Request, res: Response) => {
    const movie = await db.Movie.findByPk(req.params.id);
    if (movie === null) {
        res.json(null);
    } else {
        res.json(movie);
    }
};

//  TODO: this should only be permitted when user is admin
export const create = async (req: Request, res: Response) => {
    const movie = await db.Movie.create({
        id: req.body.id,
        title: req.body.title,
        preview_img: req.body.preview_img,
        preview_img_alt: req.body.preview_img_alt,
        description: req.body.description,
    });

    res.json(movie);
};
