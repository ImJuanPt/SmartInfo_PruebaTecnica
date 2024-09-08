const { pool } = require('../config/db');

const User = {
    // Encontrar un usuario por cedula
    async findOne(cedula) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE cc = ?', [cedula]);
        return rows[0]; // Retorna solo la primera fila
    },

    // Crear un nuevo usuario
    async create(cedula, nombre, password) {
        const [result] = await pool.execute(
            'INSERT INTO users (cc, name, password) VALUES (?, ?, ?)', 
            [cedula, nombre, password]
        );
        return result.insertId; // Retorna el ID del nuevo usuario creado
    }
};

module.exports = User;