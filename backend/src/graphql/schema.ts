export const typeDefs = `#graphql
type User {
    id: ID
    name: String
    email: String
    password: String
    is_restricted: Boolean
    is_admin: Boolean
    reviews: [Review]
    reservations: [Reservation]
}
type Review {
    id: ID!
    userId: Int!
    movieId: Int!
    text: String!
    rating: Int!
    softDeleted: Boolean
    createdAt: String
    user: User
    movie: Movie
}
type Showing {
    id: ID!
    movieId: Int!
    time: String!
    movie: Movie
}
type Movie {
    id: ID!
    title: String!
    preview_img: String!
    preview_img_alt: String!
    description: String!
    showings: [Showing]
    reviews: [Review]
}
type Reservation {
    id: ID!
    num_seats: Int!
    createdAt: String
    showing: Showing
    user: User
}
type Token {
    id: ID!
    time: String!
    userId: Int!
    user: User
}
type Query {
    users: [User]
    user(id: ID!): User
    reviews: [Review]
    review(id: ID!): Review
    movies: [Movie]
    movie(id: ID!): Movie
    reservations: [Reservation]
    reservation(id: ID!): Reservation
    showings: [Showing]
    showing(id: ID!): Showing
    tokens: [Token]
    token(id: ID!): Token
}
type Mutation {
    createUser(name: String!, email: String!, password: String!, is_restricted: Boolean, is_admin: Boolean): User
    updateUser(id: ID!, name: String, email: String, password: String, is_restricted: Boolean, is_admin: Boolean): User
    deleteUser(id: ID!): Boolean
    restrictUser(id: ID!): User
    unrestrictUser(id: ID!): User
    createReview(userId: Int!, movieId: Int!, text: String!, rating: Int!): Review
    updateReview(id: ID!, text: String, rating: Int): Review
    deleteReview(id: ID!): Boolean
    softDeleteReview(id: ID!): Boolean
    createMovie(title: String!, preview_img: String, preview_img_alt: String, description: String): Movie
    updateMovie(id: ID!, title: String, preview_img: String, preview_img_alt: String, description: String): Movie
    deleteMovie(id: ID!): Boolean
}
`;
