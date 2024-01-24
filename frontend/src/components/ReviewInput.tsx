import './styles/Bomfunk.css';
import './styles/Review.css';
import { useState, useRef } from 'react';
import { useReviews } from '../hooks/useReviews';
import StarRating from './StarRating';
import { useAuth } from '../hooks/useAuth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface ReviewInputProps {
    id?: number;
    movieId: number;
    initialRating?: number;
    initialBody?: string;
    submitReview?: (review: any) => any;
    editing?: boolean;
    setEditing?: (editing: boolean) => void;
}

export const validateReview = (review: ReviewInputProps, rating: number) => {
    for (const [key, value] of Object.entries(review)) {
        if (value === null || value === undefined || value === '') {
            return `The ${key} of your review is empty. Please fill in all fields`;
        }
        if (key === 'text' && (value.toString().length > 600 || value.toString().length < 1)) {
            return 'Please enter a review between 1 and 600 characters';
        }
    }
    if (rating === 0) {
        return 'Please select a rating';
    }
    return null;
};

//TODO: This is a lot of stuff being passed down, refactor later
function ReviewInput({
    id,
    movieId,
    initialRating,
    initialBody,
    submitReview,
    editing,
    setEditing,
}: ReviewInputProps) {
    const { auth } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef(null);
    //TODO: Potentially worth refactoring to a single object
    const [rating, setRating] = useState(initialRating || 0);
    const [text, setBody] = useState(initialBody || '');
    const { updateReviewMutation } = useReviews();

    const validateReview = (review: ReviewInputProps) => {
        for (const [key, value] of Object.entries(review)) {
            if (value === null || value === undefined || value === '') {
                return `The ${key} of your review is empty. Please fill in all fields`;
            }
            if (key === 'title' && (value.toString().length > 50 || value.toString().length < 1)) {
                return 'Please enter a title between 1 and 50 characters';
            }
            if (key === 'text' && (value.toString().length > 600 || value.toString().length < 1)) {
                return 'Please enter a review between 1 and 600 characters';
            }
        }
        if (rating === 0) {
            return 'Please select a rating';
        }
        return null;
    };

    const handleSubmit = async () => {
        const review = {
            movieId: movieId,
            userId: auth.id,
            User: auth,
            rating,
            text,
            softDeleted: false,
            toggleReviewInput: () => {}, //TODO: This is a hack, fix later
        };

        const errorMessage = validateReview(review);
        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        // Try catch and async stuff used to mock server behaviour to make transition easier later
        try {
            if (editing) {
                updateReviewMutation.mutate({ id, User: auth, ...review });
                setRating(0);
                setBody('');
                setEditing(false);
            } else {
                submitReview(review).then((response: Response) => {
                    setRating(0);
                    setBody('');
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <dialog ref={dialogRef} open={isOpen} className="review-input">
            {/* <button onClick={() => setIsOpen(false)}>Close</button> */}
            <div>{<StarRating editable={true} rating={rating} setRating={setRating} />}</div>
            <ReactQuill value={text} onChange={setBody} />
            <button className="subtle" onClick={handleSubmit}>
                Submit
            </button>
        </dialog>
    );
}

export default ReviewInput;
