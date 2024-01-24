import './styles/Bomfunk.css';
import './styles/NowShowing.css';
import MovieSummary from './MovieSummary';
import { useMovies } from '../hooks/useMovies';
import { useReviews } from '../hooks/useReviews';
import { useReservations } from '../hooks/useReservations';
import { useEffect, useState } from 'react';

/*
    NowShowing presents a grid of MovieSummary (i.e. movie picture, description
      and reviews) components.
*/

interface NowShowingProps {
    showReservationForm: (sessionId: number, sessionTime: string, movieTitle: string, moviePreviewImage: string) => void;
    seatState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function NowShowing({ showReservationForm, seatState }: NowShowingProps) {
    const [sortedByRating, setSortedByRating] = useState(false);
    const [movies, setMovies] = useState([]);
    const [sortedMovies, setSortedMovies] = useState([]);
    const [, setAvailableSeats] = useState([]);
    const { fetchRatingByMovieId } = useReviews();
    const { fetchAllRemainingSeats } = useReservations();
    const { fetchAllMovies } = useMovies();
    const [seatsDirty, setSeatsDirty] = seatState;
    

    useEffect(() => {
        const fetchData = async () => {
            const storedMovies = await fetchAllMovies();
            const storedSeats = await fetchAllRemainingSeats();

            const movieArray = Object.values(storedMovies);

            const updatedMovies = movieArray.map((movie: any) => {
                const updatedShowings = movie.showings.map((showing: any) => {
                    const availability = storedSeats.find((data) => data.showingId === showing.id);
                    const seats = availability ? availability.availableCount : 0;
                    return { ...showing, seats };
                });
                return { ...movie, showings: updatedShowings };
            });

            setAvailableSeats(storedSeats);
            setMovies(updatedMovies);
            setSortedMovies(await sortMovies(updatedMovies));
            setSeatsDirty(false);
        };
        fetchData();
    }, [seatsDirty]);

    const sortMovies = async (movies: any) => {

        const movieRatings = await Promise.all(
            movies.map(async (movie: any) => {
                const movieRating = await fetchRatingByMovieId(movie.id);
                return { ...movie, rating: movieRating };
            })
        );

        console.log(movieRatings);

        // the sort function is this way to cater for movies with NaN ratings.
        const sortedMovies = movieRatings.sort((a, b) => {
            if (!isFinite(a.rating) && !isFinite(b.rating)) {
                return 0;
            }
            if (!isFinite(a.rating)) {
                return 1;
            }
            if (!isFinite(b.rating)) {
                return -1;
            }
            return b.rating - a.rating;
        });
        return sortedMovies;

    }

    const toggleSortByRating = () => {
        const newState = !sortedByRating;
        setSortedByRating(newState);
    }

    return (
        <div className="now-showing-wrapper">
            <div className="right-full">
                <button className="subtle" onClick={toggleSortByRating}>
                    {sortedByRating ? 'Remove sort' : 'Sort by rating'}
                </button>
            </div>
            <div className="now-showing-movies-wrapper">
                { sortedByRating ? (
                    sortedMovies.map((movie) => (
                        <MovieSummary
                            key={movie.id}
                            movieId={movie.id}
                            preview_img={movie.preview_img}
                            preview_img_alt={movie.preview_img_alt}
                            title={movie.title}
                            description={movie.description}
                            showings={movie.showings}
                            showReservationForm={showReservationForm}
                        />
                    ))
                ): (
                    movies.map((movie) => (
                        <MovieSummary
                            key={movie.id}
                            movieId={movie.id}
                            preview_img={movie.preview_img}
                            preview_img_alt={movie.preview_img_alt}
                            title={movie.title}
                            description={movie.description}
                            showings={movie.showings}
                            showReservationForm={showReservationForm}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
