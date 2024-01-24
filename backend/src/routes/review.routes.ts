import express, { Express } from 'express';
import * as reviewController from '../controllers/review.controller';

const router = express.Router();

// GET Requests

// Select one review by id
router.get('/:id', reviewController.one);

//TODO: Do we want to refactor allByMovieId & allByUserId into a filter by query params route instead?

// Select all reviews with given movie id
router.get('/movieId/:movieId', reviewController.allByMovieId);

// Select all reviews with given user id
router.get('/userId/:userId', reviewController.allByUserId);

// Select all reviews
router.get('/', reviewController.all);

// Create a new review
router.post('/', reviewController.create);

// PUT Requests

// TODO: Update a review by id
router.put('/:id', reviewController.update);

// DELETE Requests

// Delete a review by id
router.delete('/:id', reviewController.remove);

// Delete all reviews by user id
router.delete('/userId/:userId', reviewController.removeAllByUserId);

export default router;
