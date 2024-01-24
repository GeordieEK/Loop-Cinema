import React, { createContext, useReducer, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_MOVIE, UPDATE_MOVIE, DELETE_MOVIE } from '../../api/movieQueries';
import { Movie } from '../../../../types/movie';

type ActionType =
    | { type: 'CREATE_MOVIE'; payload: Movie }
    | { type: 'UPDATE_MOVIE'; payload: Movie }
    | { type: 'DELETE_MOVIE'; payload: number }
    | { type: 'SET_MOVIES'; payload: Movie[] };

type StateType = { movies: Movie[] };

interface MoviesProviderProps {
    children: React.ReactNode;
}

const MoviesContext = createContext<
    | {
          state: StateType;
          dispatch: React.Dispatch<ActionType>;
          createMovie: (movie: Movie) => void;
          updateMovie: (movie: Movie) => void;
          deleteMovie: (id: number) => void;
      }
    | undefined
>(undefined);

const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'SET_MOVIES':
            return { ...state, movies: action.payload };
        case 'CREATE_MOVIE':
            return { ...state, movies: [...state.movies, action.payload] };
        case 'UPDATE_MOVIE':
            return {
                ...state,
                movies: state.movies.map((movie) =>
                    movie.id === action.payload.id ? action.payload : movie
                ),
            };
        case 'DELETE_MOVIE':
            return {
                ...state,
                movies: state.movies.filter((movie) => movie.id !== action.payload),
            };
        default:
            return state;
    }
};

export const MoviesProvider: React.FC<MoviesProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, { movies: [] });

    const [createMovieOnServer] = useMutation(CREATE_MOVIE);
    const [updateMovieOnServer] = useMutation(UPDATE_MOVIE);
    const [deleteMovieFromServer] = useMutation(DELETE_MOVIE);

    const createMovie = async (movie: Movie) => {
        dispatch({ type: 'CREATE_MOVIE', payload: { ...movie } }); // Optimistically update the UI

        try {
            const { data } = await createMovieOnServer({
                variables: {
                    title: movie.title,
                    preview_img: movie.preview_img,
                    preview_img_alt: movie.preview_img_alt,
                    description: movie.description,
                },
            });
            // Replace the temporary ID with the actual ID from the server
            dispatch({ type: 'UPDATE_MOVIE', payload: { ...movie, id: data.createMovie.id } });
        } catch (error) {
            console.error('Failed to create movie:', error);
        }
    };

    const updateMovie = async (movie: Movie) => {
        console.log('incoming movie:', movie);
        try {
            const { id, title, preview_img, preview_img_alt, description } = movie;

            const { data } = await updateMovieOnServer({
                variables: { id, title, preview_img, preview_img_alt, description },
            });
            dispatch({ type: 'UPDATE_MOVIE', payload: data.updateMovie });
        } catch (error) {
            console.error('Failed to update movie:', error);
        }
    };

    const deleteMovie = async (id: number) => {
        try {
            await deleteMovieFromServer({ variables: { id } });
            dispatch({ type: 'DELETE_MOVIE', payload: id });
        } catch (error) {
            console.error('Failed to delete movie:', error);
        }
    };

    return (
        <MoviesContext.Provider value={{ state, dispatch, createMovie, updateMovie, deleteMovie }}>
            {children}
        </MoviesContext.Provider>
    );
};

export const useMovies = () => {
    const context = useContext(MoviesContext);
    if (context === undefined) {
        throw new Error('useMovies must be used within a MoviesProvider');
    }
    return context;
};
