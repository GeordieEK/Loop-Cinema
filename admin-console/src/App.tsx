import React from 'react';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import Navbar from './components/navbar/Navbar';
import AppRoutes from './components/appRoutes/AppRoutes';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReviewsProvider } from './components/reviews/ReviewsContext';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MoviesProvider } from './components/movies/MoviesContext';

// Apollo Client
const client = new ApolloClient({
    uri: 'http://localhost:5001/graphql',
    cache: new InMemoryCache(),
});

const App = () => {
    return (
        <div className="app">
            <ApolloProvider client={client}>
                <Router>
                    <Navbar />
                    <ReviewsProvider>
                        <MoviesProvider>
                            <Dashboard>
                                <h1>Admin Dashboard</h1>
                                <AppRoutes />
                            </Dashboard>
                        </MoviesProvider>
                    </ReviewsProvider>
                </Router>
            </ApolloProvider>
        </div>
    );
};

export default App;
