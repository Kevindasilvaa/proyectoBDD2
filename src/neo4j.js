import neo4j from 'neo4j-driver';

const driver = neo4j.driver('neo4j+s://9f394200.databases.neo4j.io', neo4j.auth.basic('neo4j', 'WJtex8--vXyqlXjoFRSmjln6LpXoT1iX8jelBCxCr7Y'));


// Función para crear un nuevo usuario en Neo4j y establecer la relación LIVES_IN
export const createNeo4jUser = async (name, email, country) => {
  const session = driver.session();
  try {
    // Crear el nodo User
    const userResult = await session.run(
      `CREATE (u:User {name: $name, email: $email, country: $country}) RETURN u`,
      { name, email,country }
    );

    // Obtener la identificación del nodo User creado
    const userId = userResult.records[0].get('u').identity;

    // Crear la relación LIVES_IN si el nodo Country existe
    await session.run(
      `MATCH (u:User), (c:Country {name: $country})
       WHERE id(u) = $userId
       MERGE (u)-[:LIVES_IN]->(c)`,
      { country, userId }
    );
  } catch (error) {
    console.error("Error creating Neo4j user or setting LIVES_IN relationship:", error);
    throw error;
  } finally {
    await session.close();
  }
};

export const getAllCountries = async () => {
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (c:Country) RETURN c`
    );

    // Convertir los registros a un arreglo de objetos
    const countries = result.records.map(record => record.get('c').properties);

    return countries;
  } catch (error) {
    console.error("Error getting all countries:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Función para manejar el "me gusta"
export const handleLike = async (email, bookTitle, bookAuthor, publishedYear, coverUrl, isFavorite) => {
  const session = driver.session();
  try {
    if (isFavorite) {
      // Caso: Eliminar la relación LIKES_IT
      await session.run(
        `MATCH (u:User {email: $email})-[r:LIKES_IT]->(b:Book {title: $bookTitle})
         DELETE r`,
        { email, bookTitle }
      );
      return { message: 'Relación "me gusta" eliminada' };
    } else {
      // Caso: Crear el nodo y la relación LIKES_IT
      await session.run(
        `
        MERGE (b:Book {title: $bookTitle})
        ON CREATE SET b.author = $bookAuthor, b.publishedYear = $publishedYear, b.coverUrl = $coverUrl
        MERGE (u:User {email: $email})
        MERGE (u)-[:LIKES_IT]->(b)
        `,
        { email, bookTitle, bookAuthor, publishedYear, coverUrl }
      );
      return { message: 'Relación "me gusta" creada' };
    }
  } catch (error) {
    console.error("Error handling like operation:", error);
    throw error;
  } finally {
    await session.close();
  }
};

export const checkIfUserLikesBook = async (email, bookTitle) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $email})
      OPTIONAL MATCH (u)-[r:LIKES_IT]->(b:Book {title: $bookTitle})
      RETURN COUNT(r) > 0 AS isLiked
      `,
      { email, bookTitle }
    );

    // Devuelve true si se encontró la relación LIKES_IT, de lo contrario false
    return result.records.length > 0 && result.records[0].get('isLiked');
  } catch (error) {
    console.error('Error al verificar relación LIKES_IT:', error);
    throw error;
  } finally {
    await session.close();
  }
};

export const getLikedBooks = async (email) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $email})-[:LIKES_IT]->(b:Book)
      RETURN b.title AS title, b.author AS author, b.publishedYear AS publishedYear, b.coverUrl AS coverUrl
      `,
      { email }
    );

    // Extraer datos de los libros de los resultados de la consulta
    return result.records.map((record) => ({
      title: record.get('title'),
      author: record.get('author'),
      publishedYear: record.get('publishedYear'),
      coverUrl: record.get('coverUrl'),
    }));
  } catch (error) {
    console.error('Error al obtener libros favoritos desde Neo4j:', error);
    throw error;
  } finally {
    await session.close();
  }
};

export const getRecommedBooks = async (email) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $email})-[:LIKES_IT]->(b:Book)
      WITH collect(b.author) AS likedAuthors, collect(b.title) AS likedBookTitles
      UNWIND likedAuthors AS author
      MATCH (b2:Book) 
      WHERE b2.author = author AND NOT b2.title IN likedBookTitles
      RETURN b2.title AS title, b2.author AS author, b2.publishedYear AS publishedYear, b2.coverUrl AS coverUrl
      `,
      { email }
    );

    // Extraer datos de los libros de los resultados de la consulta
    return result.records.map((record) => ({
      title: record.get('title'),
      author: record.get('author'),
      publishedYear: record.get('publishedYear'),
      coverUrl: record.get('coverUrl'),
    }));
  } catch (error) {
    console.error('Error al obtener libros recomendados desde Neo4j:', error);
    throw error;
  } finally {
    await session.close();
  }
};

export default driver;