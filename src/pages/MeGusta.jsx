import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Book from '../components/Books';

export default function MeGusta() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        navigate("/");
      }
    });

    // Cargar favoritos desde localStorage
    const storedFavorites = localStorage.getItem('favorites');
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
  }, [navigate]);

  return (
    <div style={{ height: "100vh", backgroundColor: "#1C2C54", color: "white" }}>
      <h1>Favoritos</h1>
      <div className="container">
        <div className="row">
          {favorites && favorites.length > 0 ? (
            favorites.map((book, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <Book
                  title={book.title}
                  author={book.author}
                  publishedYear={book.publishedYear}
                  coverUrl={book.coverUrl}
                  isFavorite={true}
                  onToggleFavorite={() => { /* Aquí puedes manejar el desmarcado si lo deseas */ }}
                />
              </div>
            ))
          ) : (
            <p className="text-center">No tienes libros marcados como favoritos.</p>
          )}
        </div>
      </div>
    </div>
  );
}

