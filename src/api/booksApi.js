// /src/api/booksApi.js
import axios from 'axios';
import neo4j from 'neo4j-driver';

export const fetchBooksByTitle = async (title) => {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
  try {
    const response = await axios.get(url);
    return response.data.docs.slice(0, 10); // Limit to 10 books for now
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const importBooksToNeo4j = async (books) => {
  const driver = neo4j.driver(
    'neo4j+s://9f394200.databases.neo4j.io:7687',  // Replace with your Neo4j connection URL
    neo4j.auth.basic('neo4j', 'WJtex8--vXyqlXjoFRSmjln6LpXoT1iX8jelBCxCr7Y') // Replace with your Neo4j username and password
  );

  const session = driver.session();

  try {
    for (const book of books) {
      const title = book.title || 'Unknown Title';
      const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
      const publishedYear = book.first_publish_year || 'Unknown Year';

      await session.run(
        'MERGE (b:Book {title: $title}) SET b.author = $author, b.publishedYear = $publishedYear',
        { title, author, publishedYear: publishedYear.toString() }
      );
    }
    console.log('Books imported successfully');
  } catch (error) {
    console.error('Error importing books:', error);
  } finally {
    await session.close();
    await driver.close();
  }
};
