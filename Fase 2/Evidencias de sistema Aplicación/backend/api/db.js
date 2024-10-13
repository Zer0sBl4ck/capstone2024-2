// Importa mysql2 con soporte para promesas
const mysql = require('mysql2/promise');

// Crea una conexión a la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookshare',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Conectar y verificar la conexión
connection.getConnection()
  .then((conn) => {
    console.log('Conectado a la base de datos MySQL con id:', conn.threadId);
    conn.release(); // Libera la conexión
  })
  .catch((err) => {
    console.error('Error conectando a la base de datos:', err.stack);
  });

// Exporta la conexión
module.exports = connection;
