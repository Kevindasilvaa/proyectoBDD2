import React, { useState, useContext } from 'react';
import styles from './Books.module.css';
import { UserContext } from 'src/context/user.js'
import { checkIfUserLikesBook,  handleLike } from 'src/neo4j.js';


function Book({ title, author, publishedYear, coverUrl, isFavorite}) {

  const { user } = useContext(UserContext); 
  const [isFavorite, setIsFavorite] = useState(false); // Estado inicial del favorito
  const [loading, setLoading] = useState(true); // Estado para mostrar carga mientras se verifica

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user) {
        console.error('No hay un usuario autenticado.');
        return;
      }
  
      try {
        const isLiked = await checkIfUserLikesBook(user.id, title);
        setIsFavorite(isLiked);
      } catch (error) {
        console.error('Error al verificar el estado de favorito:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFavoriteStatus();
  }, [user, title]);

  const handleToggleFavorite = async () => {
    try {
      const response = await handleLike(
        user.id,
        title,
        author,
        publishedYear,
        coverUrl,
        isFavorite
      );

      console.log(response.message);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al manejar "me gusta":', error);
    }
  };

  return (
    <div className="card mb-3" style={{ maxWidth: "540px", color: 'black', marginBottom: '20px' }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img 
            src={coverUrl} 
            className="img-fluid rounded-start" 
            alt={`${title} cover`} 
            style={{ height: '200px', objectFit: 'cover' }} 
          />
        </div>
        <div className="col-md-8">
          <div className="card-body" style={{ height: '200px', position: 'relative' }}>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">
              <strong>Author:</strong> {author}
            </p>
            <p className="card-text">
              <strong>Published:</strong> {publishedYear}
            </p>
            <p className="card-text">
              <small className="text-body-secondary">Book details from Open Library</small>
            </p>
            {/* Botón de favoritos */}
            <button
              onClick={handleToggleFavorite}
              className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              {isFavorite ? '❤️' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Book;

  