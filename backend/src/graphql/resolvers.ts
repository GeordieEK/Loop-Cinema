import db from '../database/db';
import argon2 from 'argon2';
import { User, NewUser } from '../../../types/user';
import { Review } from '../../../types/review';
import { Movie } from '../../../types/movie';
import { Reservation } from '../../../types/reservation';

export const resolvers = {
    Review: {
        async user(review: Review) {
            return await db.User.findByPk(review.userId);
        },
    },
    User: {
        async reviews(user: User) {
            return await db.Review.findAll({
                where: {
                    userId: user.id,
                },
            });
        },
        async reservations(user: User) {
            return await db.Reservation.findAll({
                where: {
                    userId: user.id,
                },
            });
        },
    },
    Query: {
        async users() {
            console.log('grahpql resolvers users');
            const users = await db.User.findAll();
            return users;
        },
        async user(parent: User, { id }: { id: number }) {
            return await db.User.findByPk(id);
        },
        async reviews() {
            return await db.Review.findAll();
        },
        async review(parent: Review, { id }: { id: number }) {
            return await db.Review.findByPk(id);
        },
        async movies() {
            return await db.Movie.findAll({
                include: [
                    {
                        model: db.Showing,
                        as: 'showings',
                    },
                ],
            });
        },
        async movie(parent: Movie, { id }: { id: number }) {
            return await db.Movie.findByPk(id);
        },
        async reservations() {
            return await db.Reservation.findAll();
        },
        async reservation(parent: Reservation, { id }: { id: number }) {
            return await db.Reservation.findByPk(id);
        },
    },
    Mutation: {
        async createUser(parent: User, args: User) {
            const hash = await argon2.hash(args.password, { type: argon2.argon2id });
            return await db.User.create(
                {
                    name: args.name,
                    email: args.email,
                    password: hash,
                    is_restricted: args.is_restricted,
                    is_admin: args.is_admin,
                },
                { fields: ['name', 'email', 'password'] }
            );
        },
        async updateUser(parent: User, args: NewUser) {
            const user = await db.User.findByPk(args.id);
            if (!user) {
                throw new Error('User not found');
            }
            if (args.password && args.password !== user.password) {
                const hash = await argon2.hash(args.password, { type: argon2.argon2id });
                args.password = hash;
            }
            await user.update(args);
            await user.save();
            return user;
        },
        async deleteUser(parent: User, { id }: { id: number }) {
            const user = await db.User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            await user.destroy();
            return true;
        },
        async restrictUser(parent: User, { id }: { id: number }) {
            const user = await db.User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            user.is_restricted = true;
            await user.save();
            return user;
        },
        async unrestrictUser(parent: User, { id }: { id: number }) {
            const user = await db.User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            user.is_restricted = false;
            await user.save();
            return user;
        },
        async createReview(parent: Review, args: Review) {
            return await db.Review.create({
                userId: args.userId,
                movieId: args.movieId,
                text: args.text,
                rating: args.rating,
            });
        },
        async updateReview(parent: Review, args: Review) {
            const review = await db.Review.findByPk(args.id);
            if (!review) {
                throw new Error('Review not found');
            }
            review.text = args.text || review.text;
            review.rating = args.rating || review.rating;
            await review.save();
            return review;
        },
        async deleteReview(parent: Review, { id }: { id: number }) {
            const numDeleted = await db.Review.destroy({
                where: {
                    id: id,
                },
            });
            return numDeleted > 0;
        },
        async softDeleteReview(parent: Review, { id }: { id: number }) {
            const review = await db.Review.findByPk(id);
            if (!review) {
                throw new Error('Review not found');
            }
            review.softDeleted = true;
            await review.save();
            return true;
        },
        async createMovie(parent: Movie, args: Movie) {
            return await db.Movie.create({
                title: args.title,
                preview_img: args.preview_img,
                preview_img_alt: args.preview_img_alt,
                description: args.description,
            });
        },
        async updateMovie(parent: Movie, args: Movie) {
            const movie = await db.Movie.findByPk(args.id);
            if (!movie) {
                throw new Error('Movie not found');
            }
            movie.title = args.title || movie.title;
            movie.preview_img = args.preview_img || movie.preview_img;
            movie.preview_img_alt = args.preview_img_alt || movie.preview_img_alt;
            movie.description = args.description || movie.description;
            await movie.save();
            return movie;
        },
        async deleteMovie(parent: Movie, { id }: { id: number }) {
            const numDeleted = await db.Movie.destroy({
                where: {
                    id: id,
                },
            });
            return numDeleted > 0;
        },
    },
};
