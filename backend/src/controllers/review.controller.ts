import { Request, Response } from 'express';
import db from '../database/db';

//TODO: More error handling / input validation to prevent crashes

// Select one review
export const one = async (req: Request, res: Response) => {
    const review = await db.Review.findByPk(req.params.id as string);
    res.json(review);
};

// Select all reviews
export const all = async (req: Request, res: Response) => {
    const posts = await db.Review.findAll();
    res.json(posts);
};

// Select all reviews with given movie id
export const allByMovieId = async (req: Request, res: Response) => {
    if (!req.params.movieId) {
        res.status(400).json({ error: 'Missing movieId' });
        return;
    }

    const reviews = await db.Review.findAll({
        include: [
            {
                model: db.User,
            },
        ],
        where: {
            movieId: req.params.movieId,
        },
    });
    res.json(reviews);
};

// Select all reviews with given user id
export const allByUserId = async (req: Request, res: Response) => {
    if (!req.params.userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
    }
    const reviews = await db.Review.findAll({
        where: {
            userId: req.params.userId,
        },
    });
    res.json(reviews);
};

// TODO: Rate limit this route
// Create a review
export const create = async (req: Request, res: Response) => {
    const post = await db.Review.create({
        // Id & date created automatically generated
        userId: req.body.userId,
        movieId: req.body.movieId,
        text: req.body.text,
        rating: req.body.rating,
    });
    res.json(post);
};

// Update a review
export const update = async (req: Request, res: Response) => {
    const post = await db.Review.findByPk(req.params.id as string);
    if (!post) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    console.log(req.body);
    post.text = req.body.text || post.text;
    post.rating = req.body.rating || post.rating;
    await post.save();
    res.json(post);
};

// Delete a review
export const remove = async (req: Request, res: Response) => {
    const numDeleted = await db.Review.destroy({
        where: {
            id: req.params.id,
        },
    });
    res.json({ numDeleted });
};

// Delete all reviews by user id
export const removeAllByUserId = async (req: Request, res: Response) => {
    const numDeleted = await db.Review.destroy({
        where: {
            userId: req.params.userId,
        },
    });
    res.json({ numDeleted });
};
