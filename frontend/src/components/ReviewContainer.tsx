import './styles/Bomfunk.css';
// import './styles/Review.css';

import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReviewProps } from '../../../types/review';
import { Review } from './Review';
import { useAuth } from '../hooks/useAuth';
import ReviewInput from './ReviewInput';
import { useReviews } from '../hooks/useReviews';

interface ReviewContainerProps {
    movieId: number;
}

function ReviewContainer({ movieId }: ReviewContainerProps) {
    const { fetchReviewsByMovieId } = useReviews();
    const [showReviewInput, setShowReviewInput] = useState(false);
    const { auth: getUser } = useAuth();
    const { postReviewMutation, updateReviewMutation } = useReviews();

    const {
        data: reviews,
        isLoading,
        error,
    } = useQuery(['reviews', movieId], () => fetchReviewsByMovieId(movieId));

    const toggleReviewInput = () => {
        setShowReviewInput(!showReviewInput);
    };

    const submitReview = (review: ReviewProps) => {
        if (review.id) {
            updateReviewMutation.mutate(review);
        } else {
            postReviewMutation.mutate(review);
        }
        toggleReviewInput();
        return postReviewMutation.isSuccess || updateReviewMutation.isSuccess;
    };

    console.log('reviews just before loading', reviews);
    // Loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {(error as Error).message}</div>;
    }
    return (
        <section className="contrast-container">
            {reviews.length > 0 ? (
                reviews.map(
                    ({ movieId, id: reviewId, userId, createdAt, rating, text, softDeleted, User }) => {
                        return (
                            <Review
                                key={reviewId}
                                id={reviewId}
                                movieId={movieId}
                                userId={userId}
                                User={User}
                                createdAt={createdAt}
                                rating={rating}
                                text={text}
                                softDeleted={softDeleted}
                                toggleReviewInput={toggleReviewInput}
                            />
                        );
                    }
                )
            ) : (
                <p className="review-placeholder">Be the first to post a review!</p>
            )}
            {getUser && !showReviewInput ? (
                <button
                className='contrast'
                    onClick={toggleReviewInput}
                    disabled={getUser.is_restricted}
                >
                    Add your review
                </button>
            ) : (
                !getUser && <p>Sign in to post a review.</p>
            )}
            {showReviewInput && <ReviewInput submitReview={submitReview} movieId={movieId} />}
        </section>
    );
}

export default ReviewContainer;
