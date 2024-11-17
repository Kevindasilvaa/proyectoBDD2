import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { UserContext } from '../context/user';
import Book from '../components/Books';
import { getLikedBooks } from '../neo4j.js';

export default function MeGusta() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Usuario actual del contexto
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    // Verificar autenticación
    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        navigate('/');
      }
    });

    // Cargar favoritos desde Neo4j
    const fetchFavorites = async () => {
      if (!user || !user.email) {
        console.error('No hay un usuario autenticado o falta el correo electrónico.');
        setLoading(false);
        return;
      }

      try {
        const likedBooks = await getLikedBooks(user.email); // Llamada a la función para obtener favoritos
        setFavorites(likedBooks); // Actualizar estado con los libros favoritos
      } catch (error) {
        console.error('Error al obtener los libros favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate, user]);

  return (
    <div style={{ height: "100vh", backgroundColor: "#1C2C54", color: "white" }}>
      <h1>Favoritos</h1>
      {loading ? (
        <p className="text-center">Cargando tus libros favoritos...</p>
      ) : (
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
                  />
                </div>
              ))
            ) : (
              <p className="text-center">No tienes libros marcados como favoritos.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
