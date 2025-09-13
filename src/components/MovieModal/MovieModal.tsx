import { useEffect } from "react";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";
import { createPortal } from "react-dom";

interface MovieModalProps{
    movie: Movie,
    onClose:()=>void
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };

     }, [onClose]);

    return createPortal((<div onClick={handleClick} className={css.backdrop} role="dialog" aria-modal="true">
  <div className={css.modal}>
    <button onClick={onClose} className={css.closeButton} aria-label="Close modal">
      &times;
        </button>
        
    <img
      src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path??movie.poster_path}`}
      alt="movie_title"
      className={css.image}
    />
        <div className={css.content}>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <p>
        <strong>Rating:</strong> {movie.vote_average/10}
      </p>
    </div>
  </div>
</div>), document.body as HTMLElement)
};

export default MovieModal;