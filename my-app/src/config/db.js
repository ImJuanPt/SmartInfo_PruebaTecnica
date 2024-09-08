// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_smartinfo'
});

// Funcion para validar la conexión a la base de datos
async function validateConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos exitosa');
        connection.release(); 
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

module.exports = { pool, validateConnection };