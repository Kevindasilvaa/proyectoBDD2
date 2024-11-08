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
      `MATCH (u:User), (c:Country {country: $country})
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

export default driver;