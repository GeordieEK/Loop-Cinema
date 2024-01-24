import { gql } from '@apollo/client';

export const GET_RESERVATIONS = gql`
    query GetReservations {
        reservations {
            id
            createdAt
            showing {
                id
                movie {
                    id
                    title
                }
            }
            user {
                id
            }
        }
    }
`;
