import React from 'react';
import styles from './Books.module.css';

function Book({ title, author, publishedYear, coverUrl, isFavorite, onToggleFavorite }) {
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
              onClick={onToggleFavorite}
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

  