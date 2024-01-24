import React, { useEffect } from 'react';
import { useReviews } from './ReviewsContext';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../../api/reviewQueries';
import styles from './Reviews.module.css';

const Reviews: React.FC = () => {
    const { state, dispatch, softDeleteReview, restrictUser } = useReviews();
    const { loading, data } = useQuery(GET_REVIEWS);

    // Banned words that will trigger a review to be flagged
    const RUDE_WORDS = ['french', 'cucumber', 'docker', 'rebase', 'rmit'];

    useEffect(() => {
        if (data) {
            dispatch({ type: 'SET_REVIEWS', payload: data.reviews });
        }
    }, [data, dispatch]);

    // Flag reviews that contain banned words
    const flaggedReviews = state.reviews.map((review) => {
        if (RUDE_WORDS.some((word) => review.text.includes(word))) {
            return { ...review, flagged: true };
        }
        return review;
    });

    return (
        <div className={styles.reviewsContainer}>
            <h2 className={styles.reviewsTitle}>Reviews</h2>
            {!loading &&
                flaggedReviews
                    .filter((review) => !review.softDeleted)
                    .map((review) => {
                        return (
                            <div className={styles.reviewCard} key={review.id}>
                                {review.flagged && (
                                    <div className={styles.flagged}>Flagged for review</div>
                                )}
                                <div className={styles.reviewUser}>
                                    <div className={styles.reviewAttribute}>
                                        User: {review.user.name}
                                    </div>
                                    <div className={styles.reviewAttribute}>
                                        Email: {review.user.email}
                                    </div>
                                    <div className={styles.reviewAttribute}>
                                        Created at: {review.createdAt}
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.commentHeader}>Comment:</div>
                                    <div
                                        className={styles.reviewText}
                                        dangerouslySetInnerHTML={{ __html: review.text }}
                                    ></div>
                                </div>
                                <div className={styles.reviewButtons}>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => softDeleteReview(review.id)}
                                    >
                                        Delete Review
                                    </button>
                                    {!review.user.is_restricted ? (
                                        <button
                                            className={styles.blockButton}
                                            onClick={() => restrictUser(review.id, true)}
                                        >
                                            Block User
                                        </button>
                                    ) : (
                                        <button
                                            className={styles.blockButton}
                                            onClick={() => restrictUser(review.id, false)}
                                        >
                                            Unblock User
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
        </div>
    );
};

export default Reviews;
