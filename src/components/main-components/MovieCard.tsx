import React from 'react';
import "./MovieCarousel.scss";

interface Props {
    title: string;
    image: string;
}

const MovieCard: React.FC<Props> = ({ title, image }) => {
    return (
        <div className="movie-card">
            <img src={image} alt={`Poster de ${title}`} className="movie-card__image" />
            <h3 className="movie-card__title">{title}</h3>
        </div>
    );
}

export default MovieCard;