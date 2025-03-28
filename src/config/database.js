import mysql from 'mysql2/promise';

// Cria o pool de conexões
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'empresas',
  password: '159357',
  waitForConnections: true,
  connectionLimit: 10, // Limite máximo de conexões simultâneas
  queueLimit: 0, // Sem limite para fila de conexões
});

// Função para obter uma conexão do pool
const conection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error('Erro ao obter conexão do pool:', err);
    throw new Error('Não foi possível obter conexão do pool!');
  } finally {
    if (connection) {
      connection.release(); // Libere a conexão após o uso
    }
  }
};

export default conection;
