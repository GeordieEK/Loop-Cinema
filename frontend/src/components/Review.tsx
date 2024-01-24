import './styles/Bomfunk.css';
import './styles/Review.css';

import React, { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../hooks/useAuth';
import { useReviews } from '../hooks/useReviews';
import ReviewInput from './ReviewInput';
import { Review as ReviewModel } from '../../../types/review';
import { User } from '../../../types/user';

export interface ReviewProps extends ReviewModel {
    User: User;
    toggleReviewInput: () => void;
}

export const Review: React.FC<ReviewProps> = ({
    id: reviewId,
    userId,
    movieId,
    User, // User data is now included in the review data
    createdAt,
    rating,
    text,
    softDeleted,
}) => {
    const { deleteReviewMutation } = useReviews();
    const [editing, setEditing] = useState<boolean>(false);

    // Current user
    const { auth: getUser } = useAuth();
    const currentUser = getUser;

    const updateReview = () => {
        setEditing(true);
        return;
    };

    return (
        <>
            {editing ? (
                <ReviewInput
                    id={reviewId}
                    movieId={movieId}
                    initialRating={rating}
                    initialBody={text}
                    editing={editing}
                    submitReview={updateReview}
                    setEditing={setEditing}
                />
            ) : (
                <article className="contrast-subcontainer">
                    <div className="review-details">
                        <div className="left">
                            <div className="review-username">{User ? User.name : 'Error'}</div>
                            <div className="review-date">{createdAt}</div>
                        </div>
                        <div className="right">
                            <div className="review-rating">
                                {<StarRating rating={rating} editable={false} />}
                            </div>
                        </div>
                    </div>

                    {softDeleted ? (
                        <div className="review-body">
                            <i>*** This review has been deleted by the admin ***</i>
                        </div>
                    ) : (
                        <div
                            className="review-body"
                            dangerouslySetInnerHTML={{ __html: text }}
                        ></div>
                    )}

                    {currentUser &&
                        currentUser.id === User.id && ( // Adjusted to use User.id
                            <button className="contrast-subtle" onClick={() => setEditing(true)}>
                                Edit
                            </button>
                        )}
                    {currentUser &&
                        currentUser.id === User.id && ( // Adjusted to use User.id
                            <button
                                className="contrast-subtle"
                                onClick={() => deleteReviewMutation.mutate(reviewId)}
                            >
                                Delete
                            </button>
                        )}
                </article>
            )}
        </>
    );
};
