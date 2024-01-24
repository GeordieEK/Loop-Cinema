import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Reviews from '../reviews/Reviews';
import Users from '../users/Users';
import Movies from '../movies/Movies';
import Analytics from '../analytics/Analytics';
import Home from '../home/Home';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* TODO: Some kind of home route */}
            <Route path="/" element={<Home />} />
            <Route path="/reviews" element={<Reviews />} />
            {/* <Route path="/users" element={<Users />} /> */}
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/movies" element={<Movies />} />
        </Routes>
    );
};

export default AppRoutes;
