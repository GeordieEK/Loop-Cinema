import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import react quill styles
import { useMovies } from './MoviesContext';
import { Movie as MovieType } from '../../../../types/movie';
import styles from './Movie.module.css';

interface MovieProps {
    movie: MovieType;
}

const Movie: React.FC<MovieProps> = ({ movie }) => {
    const { updateMovie, deleteMovie } = useMovies();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(movie.title);
    const [editedText, setEditedText] = useState(movie.description);

    const editMovie = () => {
        setIsEditing(true);
    };

    const saveMovie = () => {
        setIsEditing(false);
        updateMovie({ ...movie, title: editedTitle, description: editedText });
    };

    const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const newText = event.target.value;
        setEditedTitle(newText);
    };

    return (
        <div className={styles.movieContainer} key={movie.id}>
            {isEditing ? (
                <input
                    className={styles.movieTitleInput}
                    type="text"
                    value={editedTitle}
                    onChange={handleTitleChange}
                />
            ) : (
                <h3 className={styles.movieTitle}>{editedTitle}</h3>
            )}
            <div className={styles.movieButtons}></div>
            {isEditing ? (
                <>
                    <ReactQuill value={editedText} onChange={setEditedText} />
                    <button className={styles.editButton} onClick={saveMovie}>
                        Save
                    </button>
                </>
            ) : (
                <>
                    {/* dangerouslySetInnerHTML ok because React-Quill escapes user input */}
                    <p dangerouslySetInnerHTML={{ __html: movie.description }}></p>
                    <div className={styles.movieButtons}>
                        <button className={styles.editButton} onClick={editMovie}>
                            Edit
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={() => deleteMovie(movie.id)}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Movie;
