import React, { useState } from 'react';
import { useMovies } from './MoviesContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles

const AddMovie: React.FC = () => {
    const { createMovie } = useMovies();
    const [title, setTitle] = useState('');
    const [preview_img, setPreviewImg] = useState('');
    const [preview_img_alt, setPreviewImgAlt] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const movie = {
            id: Date.now(), // Temporary ID until we get the ID from the server
            title,
            preview_img,
            preview_img_alt,
            description,
            showings: [], // Empty showings
        };

        createMovie(movie);

        // Clear the form
        setTitle('');
        setPreviewImg('');
        setPreviewImgAlt('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label>
                Preview Image URL:
                <input
                    value={preview_img}
                    onChange={(e) => setPreviewImg(e.target.value)}
                    required
                />
            </label>
            <label>
                Preview Image Alt Text:
                <input
                    value={preview_img_alt}
                    onChange={(e) => setPreviewImgAlt(e.target.value)}
                    required
                />
            </label>
            <label>
                Description:
                <ReactQuill value={description} onChange={setDescription} />
            </label>
            <button type="submit">Add Movie</button>
        </form>
    );
};

export default AddMovie;
