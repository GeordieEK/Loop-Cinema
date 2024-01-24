import { useMutation, useQueryClient } from 'react-query';
import { NewReview, ReviewProps } from '../../../types/review';
import axios from '../api/axios';

//TODO: I don't think returning promises here is the right move, should probably resolve here then return data?

export const useReviews = () => {
    const queryClient = useQueryClient();
    const fetchAllReviews = () => {
        return axios
            .get('http://localhost:5001/api/v1/review')
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    };

    const fetchReviewByReviewId = (reviewId: number): Promise<ReviewProps> => {
        return axios
            .get(`http://localhost:5001/api/v1/review/${reviewId}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    };

    const fetchReviewsByMovieId = (movieId: number): Promise<ReviewProps[]> => {
        return axios
            .get(`http://localhost:5001/api/v1/review/movieId/${movieId}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    };

    // TODO: This is probably a bad solution as we're calling fetchReviewsByMovieId twice
    const fetchRatingByMovieId = async (movieId: number): Promise<number> => {
        const reviews: ReviewProps[] = await fetchReviewsByMovieId(movieId);
        const totalRating = reviews.reduce((acc, review) => {
            // Don't include soft deleted reviews in rating
            if (review.softDeleted) return acc;
            return acc + review.rating;
        }, 0);
        return totalRating / reviews.length;
    };

    // TODO: Rate limit on the backend
    const postReview = (review: NewReview) => {
        return axios
            .post('http://localhost:5001/api/v1/review', review)
            .then((response) => response.data);
    };

    const updateReview = (review: NewReview) => {
        return axios
            .put(`http://localhost:5001/api/v1/review/${review.id}`, review)
            .then((response) => response.data);
    };

    const deleteReview = (reviewId: number) => {
        return axios
            .delete(`http://localhost:5001/api/v1/review/${reviewId}`)
            .then((response) => response.status);
    };

    const deleteAllReviewsByUser = (userId: number) => {
        return axios
            .delete(`http://localhost:5001/api/v1/review/userId/${userId}`)
            .then((response) => response.status);
    };

    const postReviewMutation = useMutation(postReview, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['reviews', variables.movieId]);
        },
    });

    const updateReviewMutation = useMutation(updateReview, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['reviews', variables.movieId]);
        },
    });

    const deleteReviewMutation = useMutation(deleteReview, {
        onSuccess: () => {
            queryClient.invalidateQueries('reviews');
        },
    });

    return {
        fetchAllReviews,
        fetchReviewByReviewId,
        fetchReviewsByMovieId,
        fetchRatingByMovieId,
        postReview,
        updateReview,
        deleteReview,
        deleteAllReviewsByUser,
        postReviewMutation,
        updateReviewMutation,
        deleteReviewMutation,
    };
};
