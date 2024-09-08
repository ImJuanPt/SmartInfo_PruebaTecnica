const { pool } = require('../config/db');

const Departamentos = {
    // Obtener todos los departamentos
    async getAll() {
        const [rows] = await pool.execute('SELECT * FROM departamentos ORDER BY id');
        return rows; // Retornar las filas obtenidas
    },

    // Encontrar un departamento por ID
    async find(id) {
        const [rows] = await pool.execute('SELECT * FROM departamentos WHERE id = ?', [id]);
        return rows[0]; // Retornar el primer resultado (departamento) encontrado
    },

    // Crear un nuevo departamento
    async create(nombre, descripcion, fecha_creacion) {
        const [result] = await pool.execute(
            'INSERT INTO departamentos (nombre, descripcion, fecha_creacion) VALUES (?, ?, ?)',
            [nombre, descripcion, fecha_creacion]
        );
        return result.insertId; // Retornar el ID del nuevo departamento creado
    },

    // Actualizar un departamento
    async update(cedula, nombre, email, departamento_id) {
        const [result] = await pool.execute(
            'UPDATE personas SET nombre = ?, email = ?, departamento_id = ? WHERE cedula = ?',
            [nombre, email, departamento_id, cedula] 
        );
        return result.affectedRows; // Retornar el número de filas afectadas
    },

    // Eliminar un departamento
    async delete(id) {
        const [result] = await pool.execute('DELETE FROM departamentos WHERE id = ?', [id]);
        return result.affectedRows; // Retornar el número de filas afectadas
    }
};

module.exports = Departamentos;