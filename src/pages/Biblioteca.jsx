import { onAuthStateChanged } from 'firebase/auth';
import styles from './Biblioteca.module.css';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Book from '../components/Books';

export default function Biblioteca() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState('');
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirigir si el usuario no está autenticado
    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        navigate('/');
      }
    });
  });

  async function buscador(e) {
    e.preventDefault();
    if (!filterValue) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(filterValue)}`
      );
      setBooks(response.data.docs.slice(0, 4));
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#1C2C54', color: 'white' }}>
      <div className={`search-bar-container ${styles.searchBarContainer}`}>
        <form className="d-flex">
          <input
            className="form-control form-control-lg"
            value={filterValue}
            placeholder="Escribe el nombre del libro..."
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <button className="btn btn-primary" onClick={buscador}>
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center">Searching books...</p>
      ) : (
        <div className={`container ${styles.bookList}`}>
          <div className="row">
            {books.length > 0 ? (
              books.map((book, index) => {
                const coverUrl = book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : 'https://via.placeholder.com/150';

                const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
                const publishedYear = book.first_publish_year || 'Unknown Year';

                const isFavorite = favorites.some(fav => fav.title === book.title);

                return (
                  <div className="col-md-6 mb-4" key={index}>
                    <Book
                      title={book.title || 'Unknown Title'}
                      author={author}
                      publishedYear={publishedYear}
                      coverUrl={coverUrl}
                      isFavorite={isFavorite}
                      onToggleFavorite={() => toggleFavorite({
                        title: book.title,
                        author,
                        publishedYear,
                        coverUrl
                      })}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-center">No books found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
