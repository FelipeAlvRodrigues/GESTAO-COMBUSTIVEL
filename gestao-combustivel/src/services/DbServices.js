import * as SQLite from 'expo-sqlite';
const db = await SQLite.openDatabaseAsync('fuel_manager.db');
async function criarTabelaGastos() {
  const statement = await db.prepareAsync(`
    CREATE TABLE IF NOT EXISTS gastos (
      id INTEGER PRIMARY KEY NOT NULL,
      tipo INTEGER NOT NULL,
      data TEXT NOT NULL,
      preco REAL NOT NULL,
      odometro REAL NOT NULL
    )
  `);

  try {
    await statement.executeAsync();
    console.log('Tabela "gastos" criada com sucesso.');
  } catch (error) {
    console.error('Erro ao criar a tabela:', error);
  } finally {
    await statement.finalizeAsync(); // Libera a instrução
  }
}