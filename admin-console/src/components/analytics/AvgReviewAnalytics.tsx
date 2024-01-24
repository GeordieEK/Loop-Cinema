import React, { useEffect, useRef } from 'react';
import { useReviews } from '../reviews/ReviewsContext';
import { useMovies } from '../movies/MoviesContext';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../../api/reviewQueries';
import { GET_MOVIES } from '../../api/movieQueries';
import { Chart } from 'chart.js/auto';

const AvgReviewAnalytics: React.FC = () => {
    const { state: reviewState, dispatch: reviewDispatch } = useReviews();
    const { state: movieState, dispatch: movieDispatch } = useMovies();
    const { data: reviewData } = useQuery(GET_REVIEWS);
    const { data: movieData } = useQuery(GET_MOVIES);

    useEffect(() => {
        if (reviewData) {
            reviewDispatch({ type: 'SET_REVIEWS', payload: reviewData.reviews });
        }
        if (movieData) {
            // filter softDeleted movies
            const remainingMovies = movieData.movies.filter((movie: any) => !movie.softDeleted);
            movieDispatch({ type: 'SET_MOVIES', payload: remainingMovies });
        }
    }, [reviewData, movieData, reviewDispatch, movieDispatch]);

    // Calculate the data for the charts
    const totalReviews = reviewState.reviews.length;
    const totalMovies = movieState.movies.length;
    const reviewsPerMovie = (totalReviews / totalMovies).toFixed(2);

    // TODO: Get movie with the most reviews? Need to change schema etc
    // const movieWithMostReviews = movieState.movies.reduce((prev: Movie, curr: Movie) =>
    //     prev.reviews.length > curr.reviews.length ? prev : curr
    // );

    // Create a reference for the chart canvas
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    // Create a function to render the charts
    const renderCharts = () => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy(); // Destroy the previous chart instance
            }

            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: ['Total Reviews', 'Total Movies', 'Reviews per Movie'],
                    datasets: [
                        {
                            label: 'Number of Reviews',
                            data: [totalReviews, totalMovies, reviewsPerMovie] as number[],
                            backgroundColor: ['purple', 'teal', 'orange'],
                        },
                    ],
                },
            });
        }
    };

    // Call renderCharts when the component mounts
    useEffect(() => {
        renderCharts();
    });

    return (
        <div>
            <h3>Average Reviews Per Movie</h3>
            <canvas ref={chartRef} width={400} height={200} />
        </div>
    );
};

export default AvgReviewAnalytics;
