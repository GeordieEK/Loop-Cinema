import React, { createContext, useReducer, useContext } from 'react';
import { ReviewModel } from '../../../../types/review';
import { useMutation } from '@apollo/client';
import {
    DELETE_REVIEW,
    SOFT_DELETE_REVIEW,
    RESTRICT_USER,
    UNRESTRICT_USER,
} from '../../api/reviewQueries';

type ActionType =
    | { type: 'DELETE_REVIEW'; payload: number }
    | { type: 'SOFT_DELETE_REVIEW'; payload: number }
    | { type: 'BLOCK_USER'; payload: number }
    | { type: 'UNBLOCK_USER'; payload: number }
    | { type: 'SET_REVIEWS'; payload: ReviewModel[] };

type StateType = { reviews: ReviewModel[]; blockedUsers: number[] };

interface ReviewsProviderProps {
    children: React.ReactNode;
}

const ReviewsContext = createContext<
    | {
          state: StateType;
          dispatch: React.Dispatch<ActionType>;
          deleteReview: (id: number) => void;
          softDeleteReview: (id: number) => void;
          restrictUser: (id: number, restrict: boolean) => void;
      }
    | undefined
>(undefined);

const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'SET_REVIEWS':
            return { ...state, reviews: action.payload };
        case 'DELETE_REVIEW':
            return {
                ...state,
                reviews: state.reviews.filter((review) => review.id !== action.payload),
            };
        case 'SOFT_DELETE_REVIEW':
            return {
                ...state,
                reviews: state.reviews.map((review) =>
                    review.id === action.payload ? { ...review, softDeleted: true } : review
                ),
            };
        case 'BLOCK_USER':
            return { ...state, blockedUsers: [...state.blockedUsers, action.payload] };
        case 'UNBLOCK_USER':
            return {
                ...state,
                blockedUsers: state.blockedUsers.filter((user) => user !== action.payload),
            };
        default:
            return state;
    }
};

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, { reviews: [], blockedUsers: [] });

    const [restrictUserOnServer] = useMutation(RESTRICT_USER);
    const [unrestrictUserOnServer] = useMutation(UNRESTRICT_USER);
    const [deleteReviewFromServer] = useMutation(DELETE_REVIEW);
    const [softDeleteReviewFromServer] = useMutation(SOFT_DELETE_REVIEW);

    const deleteReview = async (id: number) => {
        try {
            await deleteReviewFromServer({ variables: { id } });
            dispatch({ type: 'DELETE_REVIEW', payload: id });
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    const softDeleteReview = async (id: number) => {
        try {
            await softDeleteReviewFromServer({ variables: { id } });
            dispatch({ type: 'SOFT_DELETE_REVIEW', payload: id });
        } catch (error) {
            console.error('Failed to soft delete review:', error);
        }
    };
    const restrictUser = async (id: number, restrict: boolean) => {
        try {
            if (restrict) {
                await restrictUserOnServer({ variables: { id } });
                dispatch({ type: 'BLOCK_USER', payload: id });
            } else {
                await unrestrictUserOnServer({ variables: { id } });
                dispatch({ type: 'UNBLOCK_USER', payload: id });
            }
        } catch (error) {
            console.error('Failed to restrict user:', error);
        }
    };

    return (
        <ReviewsContext.Provider
            value={{ state, dispatch, deleteReview, softDeleteReview, restrictUser }}
        >
            {children}
        </ReviewsContext.Provider>
    );
};

export const useReviews = () => {
    const context = useContext(ReviewsContext);
    if (context === undefined) {
        throw new Error('useReviews must be used within a ReviewsProvider');
    }
    return context;
};
