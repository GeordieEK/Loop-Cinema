import React, { useEffect, useState } from 'react';
import { useMovies } from './MoviesContext';
import { useQuery } from '@apollo/client';
import { GET_MOVIES } from '../../api/movieQueries';
import Movie from './Movie';
import styles from './Movies.module.css';
import AddMovie from './AddMovie';

const Movies: React.FC = () => {
    const { state, dispatch } = useMovies();
    const { loading, error, data } = useQuery(GET_MOVIES);
    const [showAddMovie, setShowAddMovie] = useState(false);

    useEffect(() => {
        if (data) {
            dispatch({ type: 'SET_MOVIES', payload: data.movies });
        }
    }, [data, dispatch]);

    const toggleAddMovie = () => {
        setShowAddMovie((prev) => !prev);
    };

    return (
        <div className={styles.moviesContainer}>
            <h2 className={styles.moviesTitle}>Movies</h2>
            <div className={styles.addMovieBtnContainer}>
                <button className={styles.addMovieButton} onClick={toggleAddMovie}>
                    {showAddMovie ? 'Hide' : 'Add Movie'}
                </button>
            </div>
            {showAddMovie && <AddMovie />}
            {!loading && state.movies.map((movie) => <Movie key={movie.id} movie={movie} />)}
        </div>
    );
};

export default Movies;
