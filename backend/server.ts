import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import http from 'http';
import db from './src/database/db';
import logger from './src/middleware/logger';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import movie from './src/routes/movie.routes';
import reservation from './src/routes/reservation.routes';
import refreshToken from './src/routes/refreshToken.routes';
import review from './src/routes/review.routes';
import {
    protectedRouter as userProtectedRouter,
    unprotectedRouter as userUnprotectedRouter,
} from './src/routes/user.routes';
import token from './src/routes/token.routes';
import auth from './src/routes/auth.routes';
import reslogger from './src/middleware/reslogger';
import verifyJWT from './src/middleware/verifyJWT';
import { typeDefs } from './src/graphql/schema';
import { resolvers } from './src/graphql/resolvers';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';

interface MyContext {
    token?: string;
}

// Environment variables
dotenv.config();

const app: Express = express();
// Server port
const PORT = process.env.PORT;

const corsOptions = {
    // To allow requests from any client
    origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) {
        callback(null, true);
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
};

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer
const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
// Function is needed to allow async setup of graphql server
const startup = async () => {
    // Start Apollo Server
    console.log('starting...');
    await server.start();
    // Database will be sync'ed in the background.
    console.log('started...');
    db.sync();

    // Cookie parser middleware
    app.use(cookieParser());

    // Incoming message logger middleware
    app.use(logger);
    // Response logger middleware
    app.use(reslogger);

    // Body parser middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Add CORS support
    app.use(cors(corsOptions));

    // Set static folder
    app.use(express.static(path.join(__dirname, 'public')));

    // Apply the Apollo GraphQL middleware to the /graphql endpoint
    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
        })
    );

    // Unprotected routes
    // app.use('/api/v1/email', email);
    app.use('/api/v1/movie', movie);
    app.use('/api/v1/reservation', reservation);
    app.use('/api/v1/review', review);
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/refreshToken', refreshToken);
    app.use('/api/v1/user', userUnprotectedRouter);

    // Protected routes
    app.use(verifyJWT); // Verify JWT token
    app.use('/api/v1/user', userProtectedRouter);
    app.use('/api/v1/token', token);

    // Attach the Express app to the httpServer
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
};
startup();

export default app;
