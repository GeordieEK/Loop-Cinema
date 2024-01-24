import './styles/Bomfunk.css';
import './styles/NowShowing.css';
import StarRating from './StarRating';
import { useState, useEffect } from 'react';
import ClickOut from './ClickOut';
import ReviewContainer from './ReviewContainer';
import { useReviews } from '../hooks/useReviews';
import { Showing } from '../../../types/showing';
// import ReservationForm from './ReservationForm';

/*
    MovieSummary displays a single movie: image, title, description,
    today's showings. It can also display the ReviewContainer component
    for its movie.
*/

interface MovieSummaryProps {
    movieId: number;
    preview_img: string;
    preview_img_alt: string;
    title: string;
    description: string;
    showings: Showing[];
    showReservationForm: (sessionId: number, sessionTime: string, movieTitle: string, moviePreviewImage: string) => void;
}

export default function MovieSummary({
    movieId,
    preview_img,
    preview_img_alt,
    title,
    description,
    showings,
    showReservationForm,
}: MovieSummaryProps) {
    const { fetchRatingByMovieId } = useReviews();
    const [showReviews, setShowReviews] = useState(false);
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState([]);

    // Watch for changes in reviews and update rating
    useEffect(() => {
        const fetchData = async () => {
            const storedRating = await fetchRatingByMovieId(movieId);
            setRating(storedRating);
        };
        fetchData();
    }, [movieId, reviews, fetchRatingByMovieId]);

    const toggleReviews = () => {
        setShowReviews(!showReviews);
    };

    return (
        <div className="movie-summary-wrapper">
            <img className="movie_summary_preview_img" alt={preview_img_alt} src={preview_img} />
            <h2>{title}</h2>
            <StarRating rating={rating} setRating={setRating} editable={false} />
            <p
                className="description"
                dangerouslySetInnerHTML={{ __html: description }}
            ></p>
            <ul className="two-column">
                {showings.map((showing) => (
                    <li key={movieId + showing.time} className="movie_summary_showing_li">
                        <button
                            type="button"
                            className="inverted"
                            disabled={showing.seats <= 0}
                            onClick={() => showReservationForm(showing.id, showing.time, title, preview_img)}
                        >
                            {showing.time}  — {showing.seats} seats
                        </button>
                    </li>
                ))}
            </ul>
            {!showReviews && (
                <button type="button" className="subtle" onClick={toggleReviews}>
                    Show reviews
                </button>
            )}
            {showReviews && (
                <ClickOut onClick={toggleReviews}>
                    <ReviewContainer movieId={movieId} />
                </ClickOut>
            )}
        </div>
    );
}
