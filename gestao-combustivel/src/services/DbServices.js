import * as SQLite from 'expo-sqlite';

const Database = () => {
  let db;

  const getConnection = async () => {
    if (!db) {
      db = await SQLite.openDatabaseAsync('fuel_manager.db');

      const statement = await db.prepareAsync(`
        CREATE TABLE IF NOT EXISTS gastos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo INTEGER NOT NULL,
          data TEXT NOT NULL,
          preco REAL NOT NULL,
          valor REAL NOT NULL,
          odometro REAL NOT NULL
        );
      `);
      await statement.executeAsync();
      await statement.finalizeAsync();
    }
    return db;
  };

  const ExecuteQuery = async (sql, params = []) => {
    const db = await getConnection();
    
    try {
      // Para queries SELECT, usamos um método diferente
      if (sql.trim().toUpperCase().startsWith("SELECT")) {
        const statement = await db.prepareAsync(sql);
        const result = await statement.executeAsync(...params);
        const rows = await result.getAllAsync();
        await statement.finalizeAsync();
        return rows;
      } 
      // Para INSERT, UPDATE, DELETE
      else {
        const statement = await db.prepareAsync(sql);
        const result = await statement.executeAsync(...params);
        await statement.finalizeAsync();
        return result;
      }
    } catch (error) {
      console.error("Erro na execução da query:", error);
      throw error;
    }
  };

  return ExecuteQuery;
};

export default Database;