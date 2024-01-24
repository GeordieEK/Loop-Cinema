import { gql } from '@apollo/client';

export const GET_REVIEWS = gql`
    query GetReviews {
        reviews {
            id
            rating
            text
            createdAt
            user {
                id
                name
                email
                is_restricted
            }
        }
    }
`;

export const DELETE_REVIEW = gql`
    mutation DeleteReview($id: ID!) {
        deleteReview(id: $id)
    }
`;

export const SOFT_DELETE_REVIEW = gql`
    mutation SoftDeleteReview($id: ID!) {
        softDeleteReview(id: $id)
    }
`;

export const RESTRICT_USER = gql`
    mutation RestrictUser($id: ID!) {
        restrictUser(id: $id) {
            id
            is_restricted
        }
    }
`;

export const UNRESTRICT_USER = gql`
    mutation UnrestrictUser($id: ID!) {
        unrestrictUser(id: $id) {
            id
            is_restricted
        }
    }
`;
