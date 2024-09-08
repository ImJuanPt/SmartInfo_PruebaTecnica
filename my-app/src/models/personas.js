const { pool } = require('../config/db');

const Personas = {
    // Obtener todas las personas
    async getAll() {
        const [rows] = await pool.execute('SELECT * FROM personas ORDER BY id');
        return rows; // Retornar todas las filas
    },

    // Encontrar una persona por cedula
    async find(cedula) {
        const [rows] = await pool.execute('SELECT * FROM personas WHERE cedula = ?', [cedula]);
        return rows[0]; // Retornar solo la primera fila
    },

    // Crear un nuevo registro de persona
    async create(cedula, nombre, email, departamento_id) {
        const [result] = await pool.execute(
            'INSERT INTO personas (cedula, nombre, email, departamento_id) VALUES (?, ?, ?, ?)',
            [cedula, nombre, email, departamento_id]
        );
        return result.insertId; // Retornar el ID del nuevo registro
    },

    // Actualizar un registro de persona
    async update(cedula, nombre, email, departamento_id) {
        const [result] = await pool.execute(
            'UPDATE personas SET nombre = ?, email = ?, departamento_id = ? WHERE cedula = ?',
            [nombre, email, departamento_id, cedula]
        );
        return result.affectedRows; // Retornar el número de filas afectadas
    },

    // Eliminar un registro de persona por cedula
    async delete(cedula) {
        const [result] = await pool.execute('DELETE FROM personas WHERE cedula = ?', [cedula]);
        return result.affectedRows; // Retornar el número de filas afectadas
    },

    // Obtener personas por ID de departamento
    async getByDepartamento(departamento_id) {
        const [rows] = await pool.execute('SELECT * FROM personas WHERE departamento_id = ?', [departamento_id]);
        return rows; // Retornar las filas que coinciden con el departamento
    }
};

module.exports = Personas;