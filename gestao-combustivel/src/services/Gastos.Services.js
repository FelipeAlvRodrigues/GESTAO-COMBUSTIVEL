import Database from './DbServices';

const DB_EXEC = Database(); // Retorna a função ExecuteQuery

export const getGastos = async () => {
  try {
    console.log("🔍 Iniciando carregamento dos gastos...");
    const rows = await DB_EXEC(`SELECT * FROM gastos ORDER BY id DESC`);
    console.log("🛠️ Dados carregados:", rows);
    console.log("🔢 Quantidade de registros:", rows ? rows.length : 0);
    return rows || []; // Garantir que sempre retorne um array
  } catch (error) {
    console.error("Erro ao carregar gastos:", error);
    return [];
  }
};

export const insertGasto = async (param) => {
  try {
    console.log("Inserindo gasto no banco:", param); // 🔥 Depuração para verificar os dados
    
    const result = await DB_EXEC(
      `INSERT INTO gastos(tipo, data, preco, valor, odometro)
       VALUES (?, ?, ?, ?, ?)`,
      [param.tipo, param.data, param.preco, param.valor, param.odometro]
    );
    
    console.log("Resultado da inserção:", result);
    return result.lastInsertRowId || result.insertId; // Retorna o ID do registro inserido
  } catch (error) {
    console.error("Erro ao inserir gasto:", error);
    throw error;
  }
};

export const updateGasto = async (param) => {
  try {
    console.log("Atualizando gasto no banco:", param);
    
    const result = await DB_EXEC(
      `UPDATE gastos 
       SET tipo = ?, data = ?, preco = ?, valor = ?, odometro = ? 
       WHERE id = ?`,
      [param.tipo, param.data, param.preco, param.valor, param.odometro, param.id]
    );
    
    console.log("Resultado da atualização:", result);
    return result.changes;
  } catch (error) {
    console.error("Erro ao atualizar gasto:", error);
    throw error;
  }
};

export const deleteGasto = async (id) => {
  try {
    console.log("Deletando gasto com ID:", id);
    
    const result = await DB_EXEC(
      `DELETE FROM gastos WHERE id = ?`,
      [id]
    );
    
    console.log("Resultado da exclusão:", result);
    return result.changes;
  } catch (error) {
    console.error("Erro ao deletar gasto:", error);
    throw error;
  }
};