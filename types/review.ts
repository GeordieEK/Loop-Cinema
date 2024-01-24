import { User } from './user';

export interface Review {
    id: number;
    userId: number;
    movieId: number;
    createdAt: string;
    text: string;
    rating: number;
    softDeleted: boolean;
}

export interface NewReview {
    id?: number;
    createdAt?: string;
    userId: number;
    movieId: number;
    text: string;
    rating: number;
}

export interface ReviewProps extends Review {
    User: User;
    toggleReviewInput: () => void;
}

export interface ReviewModel extends Review {
    user: User;
    flagged?: boolean;
}
