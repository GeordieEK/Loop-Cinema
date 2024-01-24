import { gql } from '@apollo/client';

export const GET_MOVIES = gql`
    query GetMovies {
        movies {
            id
            title
            preview_img
            preview_img_alt
            description
            showings {
                id
                time
            }
        }
    }
`;

export const CREATE_MOVIE = gql`
    mutation CreateMovie(
        $title: String!
        $preview_img: String!
        $preview_img_alt: String!
        $description: String!
    ) {
        createMovie(
            title: $title
            preview_img: $preview_img
            preview_img_alt: $preview_img_alt
            description: $description
        ) {
            id
            title
            preview_img
            preview_img_alt
            description
        }
    }
`;

export const UPDATE_MOVIE = gql`
    mutation UpdateMovie(
        $id: ID!
        $title: String!
        $preview_img: String!
        $preview_img_alt: String!
        $description: String!
    ) {
        updateMovie(
            id: $id
            title: $title
            preview_img: $preview_img
            preview_img_alt: $preview_img_alt
            description: $description
        ) {
            id
            title
            preview_img
            preview_img_alt
            description
        }
    }
`;

export const DELETE_MOVIE = gql`
    mutation DeleteMovie($id: ID!) {
        deleteMovie(id: $id)
    }
`;
