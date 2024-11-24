import styles from './MeGusta.module.css';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { UserContext } from '../context/user';
import Book from '../components/Books';
import { getRecommedBooks } from '../neo4j';


export default function Recomendaciones() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Usuario actual del contexto
  const [recomendations, setRecomendations] = useState([]);
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    // Verificar autenticación
    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        navigate('/');
      }
    });

    // Cargar recomendaciones desde Neo4j
    const fetchRecomendations = async () => {
      if (!user || !user.email) {
        console.error('No hay un usuario autenticado o falta el correo electrónico.');
        setLoading(false);
        return;
      }

      try {
        const recommendBooks = await getRecommedBooks(user.email); // Llamada a la función para obtener favoritos
        setRecomendations(recommendBooks); // Actualizar estado con los libros favoritos
      } catch (error) {
        console.error('Error al obtener las recomendaciones para tus libros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecomendations();
  }, [navigate, user]);

  return (
    <div style={{ height: "100vh", backgroundColor: "#1C2C54", color: "white" }}>
      <h1 style={{ marginLeft: "30px" }}>Recomendaciones</h1>
      {loading ? (
        <p className="text-center">Cargando las recomendaciones para tus libros...</p>
      ) : (
        <div className="container">
          <div className="row">
            {recomendations && recomendations.length > 0 ? (
              recomendations.map((book, index) => (
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
              <p className="text-center">No tienes libros recomendados.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

styles