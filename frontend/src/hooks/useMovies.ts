import axios from 'axios';
import { Movie } from '../../../types/movie';

export const useMovies = () => {
    const fetchAllMovies = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/v1/movie');
            const data = res.data;

            if (typeof data !== 'object' || data === null) {
                throw new Error('Invalid JSON data');
            }

            const movies: { [key: string]: Movie } = data;
            return movies;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const fetchMovieByMovieId = async (id: number): Promise<Movie> => {
        try {
            const res = await axios.get(`http://localhost:5001/api/v1/movie/${id}`);
            const review = res.data;
            return review;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    return {
        fetchAllMovies,
        fetchMovieByMovieId,
    };
};
